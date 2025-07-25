<template>
  <div class="page-container">
    <div class="card-container">
      <!-- 성공 아이콘 -->
      <div class="icon-wrapper">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <!-- 주 메시지 -->
      <h1 class="main-title">
        가입 신청이 정상적으로 접수되었습니다.
      </h1>

      <!-- 설명 -->
      <p class="description">
        제출하신 정보는 관리자 검토 후 승인 절차가 진행됩니다. <br>
        승인이 완료되면 입력하신 이메일로 안내 메일이 발송될 예정입니다.
      </p>

      <!-- 신청 이메일 확인 -->
      <div v-if="userEmail" class="email-confirmation">
        가입 신청 이메일: <span class="font-semibold">{{ userEmail }}</span>
      </div>

      <!-- 버튼 -->
      <div class="button-wrapper">
        <NuxtLink to="/auth/sign-in" class="btn btn-primary">
          로그인 페이지로 돌아가기
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// 페이지 타이틀 설정
useHead({
  title: '가입 신청 완료 - Rebo O&M',
});

const route = useRoute();

// URL의 쿼리 파라미터에서 이메일 주소를 가져옵니다. (예: /auth/sign-up-pending?email=user@example.com)
const userEmail = computed(() => route.query.email || '');
</script>

<style scoped lang="postcss">
/* 페이지 전체 컨테이너 */
.page-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 p-4;
}

/* 정보를 담는 카드 */
.card-container {
  @apply max-w-lg w-full bg-white rounded-xl shadow-md p-8 text-center;
}

/* 상단 아이콘 */
.icon-wrapper {
  @apply mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100;
}

.icon {
  @apply h-6 w-6 text-green-600;
}

/* 메인 제목 */
.main-title {
  @apply mt-5 text-2xl font-bold text-gray-900;
}

/* 설명 텍스트 */
.description {
  @apply mt-2 text-base text-gray-600 leading-relaxed;
}

/* 이메일 확인 섹션 */
.email-confirmation {
  @apply mt-6 p-3 bg-gray-100 rounded-md text-sm text-gray-700;
}

/* 버튼을 감싸는 영역 */
.button-wrapper {
  @apply mt-8;
}

/* 공용 버튼 스타일 (다른 페이지와 일관성 유지) */
.btn {
  @apply w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
</style>