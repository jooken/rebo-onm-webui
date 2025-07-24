<template>
    <div>
      <label class="block font-medium mb-1">{{ label }}</label>
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :type="type"
        :required="required"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :pattern="pattern"
        class="border rounded px-3 py-2 w-full"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxlength: {
    type: [Number, String],
    default: undefined
  },
  pattern: {
    type: String,
    default: undefined
  }
})

defineEmits(['update:modelValue'])
</script>
