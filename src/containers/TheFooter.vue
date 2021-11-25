<template>
  <CFooter :fixed="false">
    <div>
      <span class="ml-1">MoodTrack @{{ new Date().getFullYear() }} UiB.</span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>
