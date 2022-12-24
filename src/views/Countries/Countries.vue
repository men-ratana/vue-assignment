<template>
  <base-header type="gradient-success" class="header pt-5 pt-lg-8 d-flex align-items-center"></base-header>
  <div class="container-fluid mt--7">
    <div class="row mt-5">
      <div class="col-xl-12 mb-5 mb-xl-0">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "countries",
  components: {},
};
</script>
  