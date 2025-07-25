<template>
  <div>
    <!-- 페이지 경로 (Breadcrumb) -->
    <nav class="breadcrumb-nav">
      <NuxtLink to="/pages/member" class="breadcrumb-link">회원 관리</NuxtLink>
      <span class="mx-2">/</span>
      <span class="breadcrumb-current">회원 목록</span>
    </nav>

    <!-- 페이지 제목 -->
    <h1 class="main-title">회원 목록</h1>

    <!-- 콘텐츠 영역 -->
    <div class="content-card">
      <!-- 목록 정보 및 액션 버튼 영역 -->
      <div class="list-header">
        <p class="total-count-text">
          총 <span class="font-semibold text-blue-600">{{ totalItems }}</span>명
        </p>
        <!-- 필요시 여기에 '신규 등록' 같은 버튼 추가 -->
      </div>

      <!-- 회원 목록 테이블 -->
      <div class="table-container">
        <table class="data-table">
          <thead class="table-head">
          <tr>
            <th scope="col" class="table-th w-20">회원번호</th>
            <th scope="col" class="table-th">닉네임</th>
            <th scope="col" class="table-th w-28">회원상태</th>
            <th scope="col" class="table-th">최종인증일시</th>
            <th scope="col" class="table-th">등록일</th>
          </tr>
          </thead>
          <tbody class="table-body">
          <!-- 데이터가 없을 경우 -->
          <tr v-if="paginatedMembers.length === 0">
            <td colspan="5" class="no-data-cell">
              등록된 회원이 없습니다.
            </td>
          </tr>
          <!-- 데이터 반복 출력 -->
          <tr v-for="member in paginatedMembers" :key="member.memberNo"
              class="table-row" @click="goToDetail(member.memberNo)">
            <td class="table-cell-center">
              {{ member.memberNo }}
            </td>
            <td class="table-cell font-medium text-gray-900">{{ member.nickname }}</td>
            <td class="table-cell-center">
              <!-- 상태에 따라 다른 스타일 적용 -->
              <span :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                getStatusInfo(member.status).class
              ]">
                {{ getStatusInfo(member.status).text }}
              </span>
            </td>
            <td class="table-cell-center">
              {{ format(new Date(member.lastAuthDateTime), 'yyyy-MM-dd HH:mm') }}
            </td>
            <td class="table-cell-center">
              {{ format(new Date(member.registerDate), 'yyyy-MM-dd') }}
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

// 회원 상태 타입 정의
type MemberStatus = 'N' | 'R' | 'B' | 'T';

// TypeScript 인터페이스 정의
interface Member {
  memberNo: number;
  nickname: string;
  status: MemberStatus;
  lastAuthDateTime: string; // ISO 8601 형식
  registerDate: string;     // ISO 8601 형식
}

// Nuxt 라우터 인스턴스
const router = useRouter();

// 상태 변수
const members = ref<Member[]>([]); // API로부터 받은 전체 회원 목록
const currentPage = ref(1);
const itemsPerPage = ref(10); // 한 페이지에 표시할 항목 수

// API 데이터 로딩 시뮬레이션
const fetchMembers = async () => {
  console.log('회원 목록을 불러옵니다...');
  // 실제로는 API를 호출합니다. 예: await api.get('/members')
  await new Promise(res => setTimeout(res, 500)); // 0.5초 딜레이

  // 샘플 데이터 생성
  const sampleData: Member[] = Array.from({ length: 45 }, (_, i) => {
    const memberNo = 1000 + (45 - i);
    const registerDate = new Date();
    registerDate.setDate(registerDate.getDate() - i * 3);

    const lastAuthDateTime = new Date(registerDate);
    lastAuthDateTime.setHours(lastAuthDateTime.getHours() + (i % 24));

    const statuses: MemberStatus[] = ['N', 'N', 'N', 'N', 'R', 'B', 'T'];
    const status = statuses[i % statuses.length];

    return {
      memberNo,
      nickname: `게이머${memberNo}`,
      status,
      lastAuthDateTime: lastAuthDateTime.toISOString(),
      registerDate: registerDate.toISOString(),
    };
  });
  members.value = sampleData.sort((a,b) => b.memberNo - a.memberNo); // 회원번호 역순 정렬
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchMembers();
});

// Computed 속성 (상태에 따라 자동으로 계산되는 값)
const totalItems = computed(() => members.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// 현재 페이지에 해당하는 데이터만 잘라내기
const paginatedMembers = computed(() => {
  if (members.value.length === 0) return [];
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return members.value.slice(startIndex, endIndex);
});

// 회원 상태 코드에 따른 텍스트와 CSS 클래스를 반환하는 함수
const getStatusInfo = (status: MemberStatus) => {
  switch (status) {
    case 'N':
      return { text: '정상', class: 'bg-blue-100 text-blue-800' };
    case 'R':
      return { text: '제한', class: 'bg-yellow-100 text-yellow-800' };
    case 'B':
      return { text: '차단', class: 'bg-red-100 text-red-800' };
    case 'T':
      return { text: '탈퇴', class: 'bg-gray-100 text-gray-800' };
    default:
      return { text: '알수없음', class: 'bg-gray-100 text-gray-800' };
  }
};

// 상세 페이지로 이동하는 함수
const goToDetail = (memberNo: number) => {
  // 실제 상세 페이지 경로로 수정하세요
  router.push(`/member-list/${memberNo}`);
};

// 페이지를 변경하는 함수
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};
</script>

<style scoped lang="postcss">
/* 기존 스타일은 변경 없이 그대로 사용하면 됩니다. */
/* 페이지 경로 (Breadcrumb) */
.breadcrumb-nav { @apply mb-4 text-sm text-gray-600; }
.breadcrumb-link { @apply text-blue-600 hover:text-blue-800 transition-colors; }
.breadcrumb-current { @apply font-medium text-gray-800; }
/* 페이지 제목 */
.main-title { @apply text-2xl font-bold text-gray-900 mb-6; }
/* 콘텐츠를 감싸는 카드 */
.content-card { @apply bg-white p-6 rounded-lg shadow-md; }
/* 목록 헤더 (총 건수 등) */
.list-header { @apply mb-4 flex justify-between items-center; }
.total-count-text { @apply text-sm text-gray-700; }
/* 테이블을 감싸는 컨테이너 (가로 스크롤) */
.table-container { @apply overflow-x-auto; }
/* 데이터 테이블 */
.data-table { @apply min-w-full divide-y divide-gray-200; }
/* 테이블 헤더 */
.table-head { @apply bg-gray-50; }
.table-th { @apply px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider; }
/* 테이블 바디 */
.table-body { @apply bg-white divide-y divide-gray-200; }
/* 데이터가 없을 때의 셀 */
.no-data-cell { @apply px-6 py-12 text-center text-sm text-gray-500; }
/* 테이블 행 */
.table-row { @apply hover:bg-gray-50 cursor-pointer transition-colors; }
/* 테이블 셀 (공통) */
.table-cell { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-600; }
/* 가운데 정렬이 필요한 셀 */
.table-cell-center { @apply px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600; }
/* 페이지네이션 컨테이너 */
.pagination-container { @apply mt-6 flex justify-center items-center space-x-2; }
/* 페이지네이션 버튼 */
.pagination-button { @apply px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 transition-colors; }
.pagination-button:not(:disabled):hover { @apply bg-gray-50; }
.pagination-button:disabled { @apply opacity-50 cursor-not-allowed; }
/* 현재 페이지 버튼 (활성화 상태) */
.pagination-button-active { @apply border-blue-500 bg-blue-500 text-white hover:bg-blue-500; }
</style>