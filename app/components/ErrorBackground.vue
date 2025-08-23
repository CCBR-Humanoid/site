<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px]" />
    <div class="blob blob-1" />
    <div class="blob blob-2" />
  </div>
</template>

<style scoped>
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.65;
  will-change: transform;
}

.blob-1 {
  top: -15%;
  left: -10%;
  width: 34rem;
  height: 34rem;
  background: radial-gradient(circle at 30% 30%, rgba(0,220,130,0.35), rgba(0,220,130,0) 60%);
  animation: floaty 10s ease-in-out infinite;
}

.blob-2 {
  bottom: -10%;
  right: -10%;
  width: 40rem;
  height: 40rem;
  background: radial-gradient(circle at 70% 70%, rgba(0,193,106,0.25), rgba(0,193,106,0) 60%);
  animation: floaty 12s ease-in-out infinite reverse;
}

@keyframes floaty {
  0% { transform: translateY(0px) translateX(0px) scale(1); }
  50% { transform: translateY(-14px) translateX(6px) scale(1.02); }
  100% { transform: translateY(0px) translateX(0px) scale(1); }
}
</style>
