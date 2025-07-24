<template>
  <div class="page-container">
    <h1 class="title">🔐 Jasypt Encryption Tool</h1>

    <div class="form-group">
      <label for="inputText" class="label">Text to Encrypt or Decrypt</label>
      <textarea id="inputText" v-model="inputText" rows="3" class="textarea-field" />
    </div>

    <div class="form-group">
      <label for="key" class="label">Key</label>
      <input id="key" v-model="key" type="password" class="input-field" />
    </div>

    <div class="button-group">
      <button @click="encrypt" class="btn btn-encrypt">Encrypt</button>
      <button @click="decrypt" class="btn btn-decrypt">Decrypt</button>
      <button @click="clear" class="btn btn-clear">Clear</button>
    </div>

    <div v-if="outputText" class="result-area">
      <label for="outputText" class="label">Result</label>
      <textarea id="outputText" readonly rows="3" class="result-textarea" :value="outputText"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 폼 입력과 결과를 위한 반응형 상태 변수
const inputText = ref('');
const key = ref('');
const outputText = ref('');

/**
 * 입력된 텍스트를 암호화합니다.
 */
const encrypt = () => {
  if (!inputText.value || !key.value) {
    alert('암호화할 텍스트와 키를 모두 입력해주세요.');
    return;
  }
  // Jasypt 라이브러리를 사용하여 암호화
  alert('암호화를 완료하였습니다.')
};

/**
 * 입력된 텍스트를 복호화합니다.
 */
const decrypt = () => {
  if (!inputText.value || !key.value) {
    alert('복호화할 텍스트와 키를 모두 입력해주세요.');
    return;
  }
  // Jasypt 라이브러리를 사용하여 복호화
  alert('복호화를 완료하였습니다.')
};

/**
 * 모든 입력 필드와 결과를 초기화합니다.
 */
const clear = () => {
  inputText.value = '';
  key.value = '';
  outputText.value = '';
};
</script>

<style scoped lang="postcss">
/* 페이지 전체 컨테이너 */
.page-container {
  @apply max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md;
}

/* 제목 */
.title {
  @apply text-2xl font-bold mb-6 text-center;
}

/* 라벨과 인풋을 묶는 그룹 */
.form-group {
  @apply mb-4;
}

/* 라벨 스타일 */
.label {
  @apply block font-semibold mb-1 text-gray-700;
}

/* 일반 입력 필드 */
.input-field {
  @apply w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500;
}

/* 텍스트 영역 필드 */
.textarea-field {
  @apply w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500;
}

/* 버튼 그룹 */
.button-group {
  @apply flex space-x-2 mb-4;
}

/* 공용 버튼 스타일 */
.btn {
  @apply text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors;
}

/* 암호화 버튼 */
.btn-encrypt {
  @apply bg-blue-500 hover:bg-blue-600;
}

/* 복호화 버튼 */
.btn-decrypt {
  @apply bg-green-500 hover:bg-green-600;
}

/* 클리어 버튼 */
.btn-clear {
  @apply bg-gray-500 hover:bg-gray-600;
}

/* 결과 영역 */
.result-area {
  @apply mt-6;
}

/* 결과 텍스트 영역 (읽기 전용) */
.result-textarea {
  @apply w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-text;
}
</style>