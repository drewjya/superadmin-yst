<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
</script>

<template>
  <div class="w-full lg:grid lg:grid-cols-2 h-screen">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              class="bg-white"
              id="email"
              v-model="email"
              type="email"
              placeholder="m@example.com"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <Input id="password" type="password" v-model="password" />
          </div>
          <Button type="submit" class="w-full"> Login </Button>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <!-- <img
        src="/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      > -->
    </div>
  </div>
</template>

<style scoped></style>
