<template>
  <table>
    <thead>
      <tr>
        <th>User</th>
        <th>Type</th>
        <th>Time</th>
        <th>Late</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="att in attendances" :key="att._id">
        <td>{{ att.userId.username }}</td>
        <td>{{ att.type }}</td>
        <td>{{ new Date(att.time).toLocaleString() }}</td>
        <td>{{ att.late ? "Yes" : "No" }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default { props: ["attendances"] };
</script>
