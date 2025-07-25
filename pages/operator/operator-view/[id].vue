<template>
  <div>
    <!-- 페이지 경로 (Breadcrumb) -->
    <nav class="breadcrumb-nav">
      <NuxtLink to="/pages/operator" class="breadcrumb-link">운영자 관리</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/pages/operator/operator-list" class="breadcrumb-link">운영자 목록</NuxtLink>
      <span class="mx-2">/</span>
      <span class="breadcrumb-current">운영자 상세 정보</span>
    </nav>

    <!-- 페이지 제목 -->
    <h1 class="main-title">운영자 상세 정보</h1>

    <!-- 상세 정보 표시 영역 -->
    <div v-if="operator" class="content-card">
      <h2 class="section-title">기본 정보</h2>
      <p class="section-subtitle">등록된 운영자의 상세 정보입니다.</p>

      <div class="info-grid">
        <dl class="info-list">
          <!-- 각 정보 항목을 dl/dt/dd로 구성 -->
          <div class="info-item">
            <dt class="info-term">고유번호</dt>
            <dd class="info-description">{{ operator.id }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">이름</dt>
            <dd class="info-description">{{ operator.name }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">이메일</dt>
            <dd class="info-description">{{ operator.email }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">폰번호</dt>
            <dd class="info-description">{{ operator.phoneNumber }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">회사명</dt>
            <dd class="info-description">{{ operator.companyName }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">부서</dt>
            <dd class="info-description">{{ operator.department }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">등록일</dt>
            <dd class="info-description">
              {{ format(new Date(operator.createdAt), 'yyyy-MM-dd HH:mm:ss') }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- 데이터 로딩 중 또는 없을 때 -->
    <div v-else class="content-card text-center">
      <p class="text-gray-500">{{ loadingMessage }}</p>
    </div>

    <!-- 액션 버튼 영역 -->
    <div v-if="operator" class="button-group">
      <button @click="goToList" type="button" class="btn btn-secondary">
        목록으로
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import { format } from 'date-fns';

// TypeScript 인터페이스 (operator-list.vue와 동일하게 정의)
interface Operator {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  department: string;
  createdAt: string;
}

// Nuxt 라우트 & 라우터
const route = useRoute();
const router = useRouter();

// 상태 변수
const operator = ref<Operator | null>(null);
const loadingMessage = ref('운영자 정보를 불러오는 중입니다...');
const isDeleting = ref(false);

// API 데이터 시뮬레이션 함수 (ID로 특정 운영자 정보 조회)
const fetchOperatorById = async (id: number): Promise<Operator | null> => {
  console.log(`${id}번 운영자 정보를 API로 요청합니다.`);
  await new Promise(res => setTimeout(res, 500));

  // 실제로는 API 호출로 데이터를 가져옵니다.
  // 여기서는 샘플 데이터를 생성합니다.
  const sampleData: Operator = {
    id: id,
    name: `운영자${id}`,
    email: `operator${id}@example.com`,
    phoneNumber: `010-1234-56${id.toString().padStart(2, '0')}`,
    companyName: '(주)컴퍼니',
    department: '솔루션팀',
    createdAt: new Date().toISOString(),
  };

  // 존재하지 않는 ID 요청 시 null을 반환하는 로직이 실제로는 필요합니다.
  return sampleData;
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // route.params.id는 파일명이 [id].vue일 때 동작합니다.
  const operatorId = Number(route.params.id);

  if (isNaN(operatorId)) {
    loadingMessage.value = '잘못된 접근입니다. ID가 올바르지 않습니다.';
    return;
  }

  const data = await fetchOperatorById(operatorId);
  if (data) {
    operator.value = data;
  } else {
    loadingMessage.value = '해당 운영자 정보가 존재하지 않습니다.';
  }
});

// 목록 페이지로 이동
const goToList = () => {
  router.push('/operator/operator-list');
};
</script>

<style scoped lang="postcss">
/* 페이지 경로 (Breadcrumb) */
.breadcrumb-nav { @apply mb-4 text-sm text-gray-600; }
.breadcrumb-link { @apply text-blue-600 hover:text-blue-800 transition-colors; }
.breadcrumb-current { @apply font-medium text-gray-800; }

/* 페이지 제목 */
.main-title { @apply text-2xl font-bold text-gray-900 mb-6; }

/* 콘텐츠 카드 */
.content-card { @apply bg-white p-8 rounded-lg shadow-md; }

/* 섹션 제목 */
.section-title { @apply text-lg font-semibold leading-7 text-gray-900; }
.section-subtitle { @apply mt-1 text-sm leading-6 text-gray-600; }

/* 정보 표시 그리드 및 목록 */
.info-grid { @apply mt-6 border-t border-gray-200; }
.info-list { @apply divide-y divide-gray-200; }
.info-item { @apply px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0; }
.info-term { @apply text-sm font-medium leading-6 text-gray-900; }
.info-description { @apply mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0; }

/* 버튼 그룹 */
.button-group { @apply flex justify-end gap-3 mt-8; }

/* 공용 버튼 스타일 */
.btn { @apply rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors; }
.btn-primary { @apply text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400; }
.btn-secondary { @apply bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50; }
.btn-reject { @apply text-white bg-red-600 hover:bg-red-700; }
</style>