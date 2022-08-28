<script lang="ts">
  import countdown from '$lib';
  const birthday = countdown('2022-11-02', 1000);
</script>

<h1>Time left:</h1>
{#each Object.entries($birthday) as [unit, value]}
  <div>
    {unit}: {value}
  </div>
{/each}
