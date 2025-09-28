<template>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user._id">
        <td>{{ user.username }}</td>
        <td>{{ user.role }}</td>
        <td><button @click="$emit('delete', user._id)">Delete</button></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default { props: ["users"] };
</script>
