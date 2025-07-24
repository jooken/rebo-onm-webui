<template>
  <!-- 페이지에 여백을 주기 위해 최상위 div를 추가하고 스타일을 적용할 수 있습니다. -->
  <div class="page-container">
    <div class="form-container">
      <h1 class="form-title">Rebo O&M 가입 신청</h1>

      <form @submit.prevent="handleSubmit" class="form-body">
        <FormField label="이름" v-model="form.name" required maxlength="20"/>
        <!-- 이메일은 이전 단계에서 인증되었으므로 읽기 전용으로 표시합니다. -->
        <FormField label="이메일" type="email" v-model="form.email" readonly required/>
        <FormField label="연락처" v-model="form.phone" placeholder="010-0000-0000" required maxlength="13"
                   pattern="^010-\d{3,4}-\d{4}$"/>
        <FormField label="회사명" v-model="form.company" required maxlength="15"/>
        <FormField label="부서" v-model="form.department" required maxlength="15"/>
        <FormField label="직급/직책" v-model="form.position" required maxlength="15"/>
        <FormField label="가입 목적" type="textarea" v-model="form.purpose" required/>
        <FormField label="비밀번호" type="password" v-model="form.password" required/>

        <!-- 실제 구현 시에는 UI/UX를 고려한 파일 업로드 컴포넌트로 대체될 수 있습니다. -->
        <div class="hidden">
          <label class="block font-medium mb-1">증명 파일 업로드</label>
          <input type="file" @change="handleFileChange" class="file-input"/>
        </div>

        <!-- 버튼에 공통 스타일을 적용합니다. -->
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">처리 중...</span>
          <span v-else>가입 신청</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import FormField from '@/components/FormField.vue'

// Nuxt의 라우터와 라우트 훅을 사용합니다.
const route = useRoute();
const router = useRouter();

// 폼 데이터를 관리하는 반응형 객체
const form = reactive({
  name: '',
  email: '', // 라우트 쿼리에서 가져와 채울 예정
  phone: '',
  company: '',
  department: '',
  position: '',
  purpose: '',
  password: '',
});

// 선택된 파일을 저장할 ref
const selectedFile = ref<File | null>(null);
// 제출 중 상태를 관리할 ref
const isSubmitting = ref(false);

// 컴포넌트가 마운트될 때 라우트 쿼리에서 이메일 주소를 가져와 폼에 채웁니다.
onMounted(() => {
  const emailFromQuery = route.query.email as string;
  if (emailFromQuery) {
    form.email = emailFromQuery;
  } else {
    // 이메일 정보가 없으면, 사용자를 이전 페이지로 돌려보내는 것이 좋습니다.
    alert('잘못된 접근입니다. 이메일 인증을 먼저 진행해주세요.');
    router.push('/sign-up');
  }
});

/**
 * 파일 입력(input type="file")의 변경 이벤트를 처리합니다.
 * @param {Event} event - input 요소의 change 이벤트 객체
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    console.log('선택된 파일:', selectedFile.value.name);
  } else {
    selectedFile.value = null;
  }
};

/**
 * 폼 제출 이벤트를 처리합니다.
 */
const handleSubmit = async () => {
  if (isSubmitting.value) return; // 중복 제출 방지
  isSubmitting.value = true;

  try {
    // 파일과 폼 데이터를 함께 보내기 위해 FormData를 사용합니다.
    const formData = new FormData();

    // 'form' 객체의 모든 키-값 쌍을 formData에 추가합니다.
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 선택된 파일이 있으면 formData에 추가합니다.
    if (selectedFile.value) {
      formData.append('attachment', selectedFile.value); // 백엔드에서 받을 필드명 (예: 'attachment')
    }

    // --- API 요청 시뮬레이션 ---
    console.log('가입 신청 데이터:', Object.fromEntries(formData.entries()));
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 실제 API 호출 로직:
    // await api.post('/auth/register', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });

    alert('가입 신청이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다.');
    router.push('/sign-in'); // 로그인 페이지로 리디렉션

  } catch (error) {
    console.error('가입 신청 실패:', error);
    alert('가입 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="postcss">
/* 페이지 전체에 상하 여백을 주기 위한 컨테이너 */
.page-container {
  @apply py-12 bg-gray-50 min-h-screen;
}

/* 가입 신청 폼을 감싸는 카드 형태의 컨테이너 */
.form-container {
  @apply max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-md;
}

/* 폼 제목 */
.form-title {
  @apply text-2xl font-bold mb-6 text-gray-900;
}

/* form 태그 자체의 스타일 (필드 간의 간격 등) */
.form-body {
  @apply space-y-4;
}

/* (숨겨진) 파일 입력 필드 스타일 */
.file-input {
  @apply border rounded px-3 py-2 w-full;
}

/*
  공용 버튼 스타일 (sign-in/sign-up 페이지의 스타일과 일관성 유지)
*/
.btn {
  @apply w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
</style>