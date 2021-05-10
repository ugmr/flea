<template>
  <v-footer inset>
    <v-col
        class="text-center"
        cols="12"
    >
      {{copyright}}
    </v-col>
  </v-footer>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Footer",
  computed: {
    ...mapState(["copyright"])
  }
}
</script>
