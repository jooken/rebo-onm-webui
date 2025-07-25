<template>
  <div v-if="sessionState.isLoaded" class="auth-page-container">
    <div class="form-wrapper">
      <div class="header-section">
        <h2 class="title">
          Rebo O&M
        </h2>
        <p class="subtitle">
          {{ subtitle }}
        </p>
      </div>

      <!-- 이메일 입력 폼 -->
      <div v-if="!verificationSent" class="form-section">
        <form @submit.prevent="issueOtpCode" class="space-y-6">
          <div>
            <label for="email" class="input-label">이메일 주소</label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                     class="input-field"
                     placeholder="이메일 주소를 입력하세요"/>
            </div>
          </div>

          <div>
            <button type="submit" class="btn btn-primary" :disabled="isVerifying">
              <span v-if="isVerifying">처리 중...</span>
              <span v-else>가입 인증 코드 요청</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 인증 코드 입력 폼 -->
      <div v-else class="form-section">
        <form @submit.prevent="verifyOtpCode" class="space-y-6">
          <div>
            <label for="code" class="input-label">인증 코드</label>
            <div class="mt-1">
              <input id="code" v-model="otpValue" name="otpValue" type="text" required maxlength="6"
                     pattern="[0-9a-fA-F]{6}"
                     @input="otpValue = otpValue.toUpperCase()"
                     class="input-field"
                     placeholder="6자리 인증 코드 입력"/>
            </div>
            <p class="helper-text">
              {{ email }}로 발송된 6자리 인증 코드를 입력하세요.
              <span class="timer-text">남은 시간: {{ formatTime(timeRemaining) }}</span>
            </p>
          </div>
          <div>
            <button type="submit" class="btn btn-primary" :disabled="isVerifying">
              <span v-if="isVerifying">인증 중...</span>
              <span v-else>인증 확인</span>
            </button>
          </div>

          <div>
            <button type="button" @click="resetOtpCode" class="btn-link">
              다른 이메일로 시도
            </button>
          </div>
        </form>
      </div>

      <!-- 오류 메시지 -->
      <div v-if="verificationError" class="error-box-wrapper">
        <div class="error-box">
          <div class="flex">
            <div class="ml-3">
              <p class="error-text">
                {{ verificationError }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 링크 -->
      <div class="footer-link-section">
        <p class="footer-text">
          이미 계정이 있으신가요?
          <NuxtLink to="/auth/sign-in" class="link">로그인</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue';
import { useRouter } from 'nuxt/app'; // Nuxt 3의 경우

// 라우터 인스턴스 (인증 성공 시 페이지 이동용)
const router = useRouter();

// 템플릿에서 사용될 상태 변수들
const subtitle = ref('새 관리자 계정을 등록하세요.');
const email = ref('');
const otpValue = ref('');
const verificationSent = ref(false); // 인증 코드 발송 여부 (UI 전환용)
const isVerifying = ref(false);      // API 요청 중 로딩 상태
const verificationError = ref<string | null>(null); // 에러 메시지

// 타이머 관련 상태
const timeRemaining = ref(180); // 남은 시간 (초), 3분
let timer: ReturnType<typeof setInterval> | null = null; // 타이머 ID

// sessionState는 외부에서 주입되는 상태로 가정하고, 여기서는 예시로 정의합니다.
const sessionState = reactive({
  isLoaded: true,
});

/**
 * 남은 시간을 "MM:SS" 형식의 문자열로 변환합니다.
 * @param {number} totalSeconds - 총 시간(초)
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * 타이머를 시작하고 1초마다 남은 시간을 감소시킵니다.
 */
const startTimer = () => {
  if (timer) clearInterval(timer);

  timeRemaining.value = 180;
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      stopTimer();
      verificationError.value = '인증 시간이 만료되었습니다. 다시 시도해주세요.';
      verificationSent.value = false;
    }
  }, 1000);
};

/**
 * 실행 중인 타이머를 중지합니다.
 */
const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

/**
 * 백엔드에 이메일로 가입용 OTP 코드 발급을 요청합니다.
 */
const issueOtpCode = async () => {
  isVerifying.value = true;
  verificationError.value = null;

  try {
    // --- API 요청 시뮬레이션 ---
    console.log(`[API] 이메일 ${email.value}로 가입용 OTP 코드 발급 요청`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 실제 코드: await authApi.requestSignUpOtp(email.value);

    // 성공 시
    verificationSent.value = true;
    startTimer();

  } catch (error) {
    console.error(error);
    // 회원가입 시에는 이미 존재하는 이메일일 수 있으므로 에러 메시지를 좀 더 구체적으로 제공할 수 있습니다.
    verificationError.value = '이미 가입된 이메일이거나, 코드 발급에 실패했습니다.';
  } finally {
    isVerifying.value = false;
  }
};

/**
 * 입력된 OTP 코드로 가입 절차를 완료합니다.
 */
const verifyOtpCode = async () => {
  isVerifying.value = true;
  verificationError.value = null;

  try {
    // --- API 요청 시뮬레이션 ---
    console.log(`[API] 이메일 ${email.value}와 코드 ${otpValue.value}로 가입 인증 시도`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 실제 코드: await authApi.confirmSignUp({ email: email.value, code: otpValue.value });

    // 임시로 코드 '123456'을 정답으로 가정
    if (otpValue.value.toUpperCase() !== '123456') {
      throw new Error('Invalid code');
    }

    // 성공 시
    stopTimer();
    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
    router.push('/auth/sign-in'); // 로그인 페이지로 이동

  } catch (error) {
    console.error(error);
    verificationError.value = '인증 코드가 올바르지 않습니다.';
  } finally {
    isVerifying.value = false;
  }
};

/**
 * 인증 절차를 초기화하고 이메일 입력 화면으로 돌아갑니다.
 */
const resetOtpCode = () => {
  stopTimer();
  verificationSent.value = false;
  otpValue.value = '';
  verificationError.value = null;
};

// 컴포넌트가 언마운트될 때 타이머를 정리합니다.
onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped lang="postcss">
/* 전체 페이지 컨테이너 */
.auth-page-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8;
}

/* 폼 전체를 감싸는 래퍼 */
.form-wrapper {
  @apply max-w-md w-full space-y-8;
}

/* 헤더 (제목, 부제목) */
.header-section {
  @apply text-center;
}
.title {
  @apply mt-6 text-3xl font-extrabold text-gray-900;
}
.subtitle {
  @apply mt-2 text-sm text-gray-600;
}

/* 폼 영역 */
.form-section {
  @apply mt-8;
}

/* 입력 필드 라벨 */
.input-label {
  @apply block text-sm font-medium text-gray-700;
}

/* 입력 필드 */
.input-field {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}

/* 공용 버튼 스타일 */
.btn {
  @apply w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
/* 주 버튼 (파란색) */
.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
/* 링크 형태 버튼 */
.btn-link {
  @apply inline-flex text-sm text-blue-600 hover:text-blue-500;
}

/* 입력 필드 하단 도움말 텍스트 */
.helper-text {
  @apply mt-2 text-sm text-gray-500;
}
/* 남은 시간 텍스트 */
.timer-text {
  @apply font-medium text-red-500;
}

/* 오류 메시지 박스 */
.error-box-wrapper {
  @apply mt-4;
}
.error-box {
  @apply bg-red-50 border-l-4 border-red-400 p-4;
}
.error-text {
  @apply text-sm text-red-700;
}

/* 하단 링크 영역 */
.footer-link-section {
  @apply mt-8;
}
.footer-text {
  @apply mt-4 text-sm text-center text-gray-600;
}
.link {
  @apply font-medium text-blue-600 hover:text-blue-500;
}
</style>