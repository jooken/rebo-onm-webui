<template>
  <div>
    <!-- 페이지 경로 (Breadcrumb) -->
    <nav class="breadcrumb-nav">
      <NuxtLink to="/pages/operator" class="breadcrumb-link">운영자 관리</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/pages/operator/applicant-list" class="breadcrumb-link">운영자 가입 신청 관리</NuxtLink>
      <span class="mx-2">/</span>
      <span class="breadcrumb-current">신청자 상세 정보</span>
    </nav>

    <!-- 페이지 제목 -->
    <h1 class="main-title">운영자 가입 신청 상세</h1>

    <!-- 상세 정보 표시 영역 -->
    <div v-if="applicant" class="content-card">
      <h2 class="section-title">신청자 정보</h2>
      <p class="section-subtitle">운영자 가입을 신청한 사용자의 상세 정보입니다.</p>

      <div class="info-grid">
        <dl class="info-list">
          <!-- 각 정보 항목을 dl/dt/dd로 구성 -->
          <div class="info-item">
            <dt class="info-term">신청번호</dt>
            <dd class="info-description">{{ applicant.sequenceNo }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">신청일시</dt>
            <dd class="info-description">
              {{ format(new Date(applicant.applyDateTime), 'yyyy-MM-dd HH:mm:ss') }}
            </dd>
          </div>
          <div class="info-item">
            <dt class="info-term">이름</dt>
            <dd class="info-description">{{ applicant.name }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">이메일</dt>
            <dd class="info-description">{{ applicant.email }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">연락처</dt>
            <dd class="info-description">{{ applicant.phone }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">회사명</dt>
            <dd class="info-description">{{ applicant.companyName }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">부서</dt>
            <dd class="info-description">{{ applicant.departmentName }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-term">직책/직급</dt>
            <dd class="info-description">{{ applicant.position }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- 데이터 로딩 중 또는 없을 때 -->
    <div v-else class="content-card text-center">
      <p class="text-gray-500">{{ loadingMessage }}</p>
    </div>

    <!-- 액션 버튼 영역 -->
    <div v-if="applicant" class="button-group">
      <button @click="goToList" type="button" class="btn btn-secondary">
        목록으로
      </button>
      <button @click="openReviewModal('N')" type="button" class="btn btn-reject">
        가입 거절
      </button>
      <button @click="openReviewModal('Y')" type="button" class="btn btn-approve">
        가입 승인
      </button>
    </div>

    <!-- 심사 결과 등록 모달 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeReviewModal">
      <div class="modal-content">
        <h3 class="modal-title">심사 결과 등록</h3>

        <div class="form-group">
          <label class="form-label">심사 결과</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="reviewResult" value="N" class="form-radio" />
              <span>가입 거절</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="reviewResult" value="Y" class="form-radio" />
              <span>가입 승인</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="review-comment" class="form-label">심사 의견 ({{ reviewResult === 'N' ? '필수' : '선택' }})</label>
          <textarea
              id="review-comment"
              v-model="reviewComment"
              rows="4"
              class="form-textarea"
              placeholder="심사 의견을 입력해주세요."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeReviewModal">취소</button>
          <button class="btn btn-primary" @click="submitReview" :disabled="isSubmitting">
            <span v-if="isSubmitting">처리 중...</span>
            <span v-else>확인</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import { format } from 'date-fns';

// TypeScript 인터페이스
interface Applicant {
  sequenceNo: number;
  applyDateTime: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  departmentName: string;
  position: string;
}

// Nuxt 라우트 & 라우터
const route = useRoute();
const router = useRouter();

// 상태 변수
const applicant = ref<Applicant | null>(null);
const loadingMessage = ref('신청자 정보를 불러오는 중입니다...');
const isModalOpen = ref(false);
const reviewResult = ref<'Y' | 'N'>('Y');
const reviewComment = ref('');
const isSubmitting = ref(false);

// API 데이터 시뮬레이션 함수
const fetchApplicantById = async (id: number): Promise<Applicant | null> => {
  console.log(`${id}번 신청자 정보를 API로 요청합니다.`);
  await new Promise(res => setTimeout(res, 500));

  // 실제로는 API 호출로 데이터를 가져옵니다.
  // 여기서는 샘플 데이터를 생성합니다.
  const sampleData: Applicant = {
    sequenceNo: id,
    applyDateTime: new Date().toISOString(),
    name: `신청자${id}`,
    email: `applicant${id}@example.com`,
    phone: '010-1234-5678',
    companyName: '테스트컴퍼니',
    departmentName: 'R&D',
    position: '선임연구원',
  };

  // 요청한 ID가 존재한다고 가정하고 데이터를 반환합니다.
  // 존재하지 않는 ID 요청 시 null을 반환하는 로직이 필요할 수 있습니다.
  return sampleData;
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  const applicantId = Number(route.params.id);
  if (isNaN(applicantId)) {
    loadingMessage.value = '잘못된 접근입니다. ID가 올바르지 않습니다.';
    return;
  }

  const data = await fetchApplicantById(applicantId);
  if (data) {
    applicant.value = data;
  } else {
    loadingMessage.value = '해당 신청자 정보가 존재하지 않습니다.';
  }
});

// 목록 페이지로 이동
const goToList = () => {
  router.push('/operator/applicant-list');
};

// 심사 모달 열기
const openReviewModal = (result: 'Y' | 'N') => {
  reviewResult.value = result;
  isModalOpen.value = true;
};

// 심사 모달 닫기
const closeReviewModal = () => {
  if (isSubmitting.value) return;
  isModalOpen.value = false;
  reviewComment.value = ''; // 모달 닫을 때 코멘트 초기화
};

// 심사 결과 제출
const submitReview = async () => {
  // 유효성 검사: 거절 시 심사 의견 필수
  if (reviewResult.value === 'N' && !reviewComment.value.trim()) {
    alert('가입 거절 시에는 심사 의견을 반드시 입력해야 합니다.');
    return;
  }

  isSubmitting.value = true;
  try {
    console.log('심사 결과 API 전송:', {
      applicantId: applicant.value?.sequenceNo,
      result: reviewResult.value,
      comment: reviewComment.value,
    });
    // 실제 API 호출 로직
    await new Promise(res => setTimeout(res, 1000));

    alert(`가입 ${reviewResult.value === 'Y' ? '승인' : '거절'} 처리가 완료되었습니다.`);
    closeReviewModal();
    goToList(); // 처리 후 목록으로 이동

  } catch (error) {
    console.error('심사 처리 실패:', error);
    alert('처리 중 오류가 발생했습니다.');
  } finally {
    isSubmitting.value = false;
  }
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
.btn-approve { @apply text-white bg-blue-600 hover:bg-blue-700; }
.btn-reject { @apply text-white bg-red-600 hover:bg-red-700; }

/* --- 모달 관련 스타일 --- */
.modal-overlay { @apply fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50; }
.modal-content { @apply bg-white p-8 rounded-lg w-full max-w-lg shadow-xl; }
.modal-title { @apply text-xl font-semibold mb-6; }
.modal-actions { @apply flex justify-end gap-3 mt-8; }

/* 폼 그룹 및 라벨 */
.form-group { @apply mb-5; }
.form-label { @apply block text-sm font-medium text-gray-700 mb-2; }

/* 라디오 버튼 그룹 */
.radio-group { @apply flex items-center gap-6; }
.radio-label { @apply flex items-center gap-2 text-sm cursor-pointer; }
.form-radio { @apply h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500; }

/* 텍스트 영역 */
.form-textarea {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>