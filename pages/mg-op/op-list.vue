<template>
  <div>
    <!-- 페이지 경로 (Breadcrumb) -->
    <nav class="breadcrumb-nav">
      <NuxtLink to="/mg-op" class="breadcrumb-link">운영자 관리</NuxtLink>
      <span class="mx-2">/</span>
      <span class="breadcrumb-current">운영자 목록</span>
    </nav>

    <!-- 페이지 제목 -->
    <h1 class="main-title">운영자 목록</h1>

    <!-- 콘텐츠 영역 -->
    <div class="content-card">
      <!-- 목록 정보 및 액션 버튼 영역 -->
      <div class="list-header">
        <p class="total-count-text">
          총 <span class="font-semibold text-blue-600">{{ totalItems }}</span>건
        </p>
        <!-- 필요시 여기에 '신규 등록' 같은 버튼 추가 -->
        <!-- 예시: <button class="action-button">신규 운영자 등록</button> -->
      </div>

      <!-- 운영자 목록 테이블 -->
      <div class="table-container">
        <table class="data-table">
          <thead class="table-head">
          <tr>
            <th scope="col" class="table-th">번호</th>
            <th scope="col" class="table-th">이름</th>
            <th scope="col" class="table-th">이메일</th>
            <th scope="col" class="table-th">폰번호</th>
            <th scope="col" class="table-th">회사명</th>
            <th scope="col" class="table-th">부서</th>
            <th scope="col" class="table-th">등록일</th>
          </tr>
          </thead>
          <tbody class="table-body">
          <!-- 데이터가 없을 경우 -->
          <tr v-if="paginatedOperators.length === 0">
            <td colspan="7" class="no-data-cell">
              등록된 운영자가 없습니다.
            </td>
          </tr>
          <!-- 데이터 반복 출력 -->
          <tr v-for="(operator, index) in paginatedOperators" :key="operator.id"
              class="table-row" @click="goToDetail(operator.id)">
            <td class="table-cell-center w-16">
              <!-- 전체 개수에서 역순으로 번호 매기기 -->
              {{ totalItems - ((currentPage - 1) * itemsPerPage + index) }}
            </td>
            <td class="table-cell font-medium text-gray-900">{{ operator.name }}</td>
            <td class="table-cell">{{ operator.email }}</td>
            <td class="table-cell">{{ operator.phoneNumber }}</td>
            <td class="table-cell">{{ operator.companyName }}</td>
            <td class="table-cell">{{ operator.department }}</td>
            <td class="table-cell-center">
              {{ format(new Date(operator.createdAt), 'yyyy-MM-dd') }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination-container">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
          이전
        </button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="[
          'pagination-button',
          { 'pagination-button-active': currentPage === page }
        ]">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'nuxt/app';
import { format } from 'date-fns';

// TypeScript 인터페이스 정의
interface Operator {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  department: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
}

// Nuxt 라우터 인스턴스
const router = useRouter();

// 상태 변수
const operators = ref<Operator[]>([]); // API로부터 받은 전체 목록
const currentPage = ref(1);
const itemsPerPage = ref(10); // 한 페이지에 표시할 항목 수

// API 데이터 로딩 시뮬레이션
const fetchOperators = async () => {
  console.log('운영자 목록을 불러옵니다...');
  // 실제로는 API를 호출합니다. 예: await api.get('/operators')
  await new Promise(res => setTimeout(res, 500)); // 0.5초 딜레이

  // 샘플 데이터 생성
  const sampleData: Operator[] = Array.from({ length: 32 }, (_, i) => {
    const id = 32 - i;
    const date = new Date();
    date.setDate(date.getDate() - i * 3);
    return {
      id,
      name: `운영자${id}`,
      email: `operator${id}@example.com`,
      phoneNumber: `010-1234-56${id.toString().padStart(2, '0')}`,
      companyName: `(주)컴퍼니${i % 5 + 1}`,
      department: `솔루션팀`,
      createdAt: date.toISOString(),
    };
  });
  operators.value = sampleData;
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchOperators();
});

// Computed 속성 (상태에 따라 자동으로 계산되는 값)
const totalItems = computed(() => operators.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// 현재 페이지에 해당하는 데이터만 잘라내기
const paginatedOperators = computed(() => {
  if (operators.value.length === 0) return [];
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return operators.value.slice(startIndex, endIndex);
});

// 상세 페이지로 이동하는 함수
const goToDetail = (operatorId: number) => {
  // 실제 상세 페이지 경로로 수정하세요
  router.push(`/mg-op/op-list/${operatorId}`);
};

// 페이지를 변경하는 함수
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};
</script>

<style scoped lang="postcss">
/* 페이지 경로 (Breadcrumb) */
.breadcrumb-nav {
  @apply mb-4 text-sm text-gray-600;
}
.breadcrumb-link {
  @apply text-blue-600 hover:text-blue-800 transition-colors;
}
.breadcrumb-current {
  @apply font-medium text-gray-800;
}

/* 페이지 제목 */
.main-title {
  @apply text-2xl font-bold text-gray-900 mb-6;
}

/* 콘텐츠를 감싸는 카드 */
.content-card {
  @apply bg-white p-6 rounded-lg shadow-md;
}

/* 목록 헤더 (총 건수 등) */
.list-header {
  @apply mb-4 flex justify-between items-center;
}
.total-count-text {
  @apply text-sm text-gray-700;
}

/* 테이블을 감싸는 컨테이너 (가로 스크롤) */
.table-container {
  @apply overflow-x-auto;
}

/* 데이터 테이블 */
.data-table {
  @apply min-w-full divide-y divide-gray-200;
}

/* 테이블 헤더 */
.table-head {
  @apply bg-gray-50;
}
.table-th {
  @apply px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider;
}

/* 테이블 바디 */
.table-body {
  @apply bg-white divide-y divide-gray-200;
}

/* 데이터가 없을 때의 셀 */
.no-data-cell {
  @apply px-6 py-12 text-center text-sm text-gray-500;
}

/* 테이블 행 */
.table-row {
  @apply hover:bg-gray-50 cursor-pointer transition-colors;
}

/* 테이블 셀 (공통) */
.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-600;
}
/* 가운데 정렬이 필요한 셀 */
.table-cell-center {
  @apply px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600;
}

/* 페이지네이션 컨테이너 */
.pagination-container {
  @apply mt-6 flex justify-center items-center space-x-2;
}

/* 페이지네이션 버튼 */
.pagination-button {
  @apply px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 transition-colors;
}
.pagination-button:not(:disabled):hover {
  @apply bg-gray-50;
}
.pagination-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 현재 페이지 버튼 (활성화 상태) */
.pagination-button-active {
  @apply border-blue-500 bg-blue-500 text-white hover:bg-blue-500;
}
</style>