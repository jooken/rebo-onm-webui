<template>
  <div v-if="sessionState.isLoaded" class="page-container">
    <div class="form-wrapper">
      <div class="header-section">
        <h2 class="title">
          약관 동의
        </h2>
        <p class="subtitle">
          서비스 이용을 위해 아래 약관에 동의해 주세요
        </p>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 전체 동의 -->
          <div class="all-agree-section">
            <label class="flex items-center">
              <input type="checkbox" v-model="allAgreed" @change="toggleAllAgreements"
                     class="checkbox-input" />
              <span class="ml-3 text-lg font-semibold text-gray-900">전체 동의</span>
            </label>
            <p class="ml-8 text-sm text-gray-500">
              필수 및 선택 약관에 모두 동의합니다.
            </p>
          </div>

          <!-- 개별 약관 목록 -->
          <div class="terms-list">
            <div v-for="termsCode in termsKeyList" :key="termsCode" class="terms-item">
              <label class="flex items-start">
                <input type="checkbox" v-model="termsMap[termsCode].agreed"
                       @change="updateAllAgreedState"
                       class="checkbox-input mt-0.5" />
                <div class="ml-3 flex-1">
                  <div class="terms-item-header">
                    <div>
                      <span class="terms-title">{{ termsMap[termsCode].terms.title }}</span>
                      <span class="required-badge">({{
                          termsMap[termsCode].terms.required ? '필수' : '선택'
                        }})</span>
                    </div>
                    <button type="button" @click="showTermsModal(termsCode)"
                            class="view-terms-button">전문보기</button>
                  </div>
                  <p class="terms-summary">
                    {{ termsMap[termsCode].terms.summary || '약관 요약이 제공되지 않았습니다.' }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- 제출 버튼 -->
          <div class="pt-6">
            <button type="submit" :disabled="!isRequiredAgreed || isSubmitting" class="btn btn-primary">
              <span v-if="isSubmitting">처리 중...</span>
              <span v-else>동의하고 계속하기</span>
            </button>
          </div>

          <!-- 필수 약관 안내 -->
          <div v-if="!isRequiredAgreed" class="text-center">
            <p class="text-sm text-red-600">
              필수 약관에 모두 동의해야 서비스를 이용할 수 있습니다.
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- 약관 전문 모달 -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">
              {{ modalContent.title }}
            </h3>
            <button @click="closeModal" class="modal-close-button">
              <span class="sr-only">닫기</span>
              ✕
            </button>
          </div>

          <div class="modal-body">
            <div class="prose max-w-none text-sm text-gray-700 whitespace-pre-wrap" v-html="parsedContent">
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import { marked } from 'marked';

// TypeScript 인터페이스 정의
interface TermDetail {
  code: string;
  title: string;
  required: boolean;
  summary: string;
  content: string; // 마크다운 형식의 전체 내용
}

interface TermState {
  agreed: boolean;
  terms: TermDetail;
}

const router = useRouter();

// --- 상태 변수 ---
const sessionState = reactive({ isLoaded: true }); // 이전과 동일하게 외부에서 온다고 가정
const termsMap = reactive<Record<string, TermState>>({});
const termsKeyList = ref<string[]>([]);
const allAgreed = ref(false);
const isSubmitting = ref(false);
const showModal = ref(false);
const modalContent = reactive({ title: '', content: '' });

// --- API 데이터 시뮬레이션 ---
// 실제로는 onMounted에서 API를 호출하여 이 데이터를 가져옵니다.
const fetchTermsData = async (): Promise<TermDetail[]> => {
  console.log('[API] 약관 데이터 요청');
  await new Promise(res => setTimeout(res, 300));
  return [
    {
      code: 'terms_of_service',
      title: '서비스 이용약관',
      required: true,
      summary: 'Rebo O&M 서비스 이용에 관한 전반적인 규칙과 사용자의 권리 및 의무를 명시합니다.',
      content: '## 제1조 (목적)\n\n이 약관은 Rebo O&M 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'
    },
    {
      code: 'privacy_policy',
      title: '개인정보 처리방침',
      required: true,
      summary: '서비스 제공을 위해 수집하는 개인정보의 항목, 목적, 보유 기간 등에 대한 안내입니다.',
      content: '## 개인정보의 수집 및 이용 목적\n\n회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.'
    },
    {
      code: 'marketing_agreement',
      title: '마케팅 정보 수신 동의',
      required: false,
      summary: '이벤트, 프로모션 등 유용한 마케팅 정보를 이메일, SMS 등으로 수신하는 것에 동의합니다.',
      content: '## 마케팅 및 광고에의 활용\n\n신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.'
    },
  ];
};

// --- Computed 속성 ---
// 필수 약관에 모두 동의했는지 확인
const isRequiredAgreed = computed(() => {
  return termsKeyList.value
      .filter(key => termsMap[key].terms.required)
      .every(key => termsMap[key].agreed);
});

// 모달에 표시될 약관 내용을 HTML로 파싱
const parsedContent = computed(() => {
  return marked.parse(modalContent.content);
});


// --- 함수 ---
// 전체 동의 체크박스 토글
const toggleAllAgreements = () => {
  const isChecked = allAgreed.value;
  termsKeyList.value.forEach(key => {
    termsMap[key].agreed = isChecked;
  });
};

// 개별 동의 체크 시 전체 동의 상태 업데이트
const updateAllAgreedState = () => {
  allAgreed.value = termsKeyList.value.every(key => termsMap[key].agreed);
};

// 약관 전문 보기 모달 열기
const showTermsModal = (termsCode: string) => {
  const term = termsMap[termsCode].terms;
  modalContent.title = term.title;
  modalContent.content = term.content;
  showModal.value = true;
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

// 폼 제출 처리
const handleSubmit = async () => {
  if (!isRequiredAgreed.value) {
    alert('필수 약관에 모두 동의해야 합니다.');
    return;
  }
  isSubmitting.value = true;
  try {
    // API로 동의 내역 전송 (시뮬레이션)
    const agreementData = termsKeyList.value.map(key => ({
      code: key,
      agreed: termsMap[key].agreed,
    }));
    console.log('[API] 동의 내역 전송:', agreementData);
    await new Promise(res => setTimeout(res, 1000));

    // 성공 시 가입 폼 페이지로 이동 (이메일 정보는 쿼리로 전달)
    // 실제로는 이전 단계의 이메일 정보를 상태 관리(Pinia)나 쿼리에서 가져와야 함
    const email = 'user@example.com'; // 임시 이메일
    router.push(`/auth/sign-up-form?email=${email}`);

  } catch (error) {
    console.error('약관 동의 처리 실패:', error);
    alert('처리 중 오류가 발생했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

// --- 라이프사이클 훅 ---
onMounted(async () => {
  const data = await fetchTermsData();
  const initialMap: Record<string, TermState> = {};
  data.forEach(term => {
    initialMap[term.code] = { agreed: false, terms: term };
  });
  Object.assign(termsMap, initialMap);
  termsKeyList.value = data.map(term => term.code);
});
</script>

<style scoped lang="postcss">
/* 전체 페이지 컨테이너 */
.page-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8;
}

/* 폼 상위 래퍼 */
.form-wrapper {
  @apply max-w-2xl w-full space-y-8;
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

/* 약관 동의 폼 컨테이너 */
.form-container {
  @apply bg-white rounded-lg shadow-md p-6;
}

/* 전체 동의 섹션 */
.all-agree-section {
  @apply border-b border-gray-200 pb-4;
}

/* 약관 목록 */
.terms-list {
  @apply space-y-4;
}

/* 개별 약관 항목 */
.terms-item {
  @apply border border-gray-200 rounded-lg p-4;
}

/* 개별 약관 헤더 (제목, 필수/선택, 전문보기 버튼) */
.terms-item-header {
  @apply flex items-center justify-between;
}

/* 개별 약관 제목 */
.terms-title {
  @apply text-base font-medium text-gray-900;
}

/* (필수)/(선택) 배지 */
.required-badge {
  @apply text-red-500 text-sm ml-1;
}

/* 전문보기 버튼 */
.view-terms-button {
  @apply text-blue-600 hover:text-blue-500 text-sm underline ml-auto;
}

/* 약관 요약 텍스트 */
.terms-summary {
  @apply text-sm text-gray-500 mt-1;
}

/* 체크박스 공통 스타일 */
.checkbox-input {
  @apply h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
}

/* 공용 버튼 스타일 */
.btn {
  @apply w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}

/* 모달 스타일 */
.modal-backdrop {
  @apply fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50;
}
.modal-container {
  @apply relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white;
}
.modal-content {
  @apply mt-3;
}
.modal-header {
  @apply flex items-center justify-between mb-4;
}
.modal-title {
  @apply text-lg font-medium text-gray-900;
}
.modal-close-button {
  @apply text-gray-400 hover:text-gray-600;
}
.modal-body {
  @apply max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50;
}
.modal-footer {
  @apply flex justify-end mt-4;
}

/* `marked`가 생성하는 HTML을 위한 스타일 (Tailwind Typography 플러그인 스타일) */
.prose :where(h2):not(:where([class~="not-prose"] *)) {
  @apply text-xl font-semibold mt-4 mb-2;
}
</style>