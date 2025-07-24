<template>
  <div
      class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div>
      <div>
        <h2>페이지영역</h2>
        <ul>
          <li>
            <NuxtLink to="/sign-in">/sign-in</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/sign-up">/sign-up</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/sign-up-form?email=jooken" >/sign-up-form</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/sign-up-pending">/sign-up-pending</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms-agreement">/terms-agreement</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
