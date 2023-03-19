<script>
export default {
  props: ["expires"],
  data() {
    return {
      expiresAfter: "30 : 00",
    };
  },
  mounted() {
    let interval = setInterval(() => {
      const expires = new Date(this.expires) - new Date();

      if (expires < 0) {
        this.expiresAfter = "00 : 00";
        return clearInterval(interval);
      }

      let seconds = new Date(expires).getSeconds();
      const minutes = new Date(expires).getMinutes();
      if (seconds < 10) seconds = "0" + seconds;
      this.expiresAfter = `${minutes} : ${seconds}`;
    }, 1000);
    this.interval = interval;
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>

<template>
  <span>{{ this.expiresAfter }}</span>
</template>
