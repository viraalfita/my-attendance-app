<template>
  <table>
    <thead>
      <tr>
        <th>User</th>
        <th>Reason</th>
        <th>Start</th>
        <th>End</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="leave in leaves" :key="leave._id">
        <td>{{ leave.userId.username }}</td>
        <td>{{ leave.reason }}</td>
        <td>{{ new Date(leave.startDate).toLocaleDateString() }}</td>
        <td>{{ new Date(leave.endDate).toLocaleDateString() }}</td>
        <td>{{ leave.status }}</td>
        <td>
          <button
            v-if="leave.status === 'waiting'"
            @click="$emit('approve', leave._id)"
          >
            Approve
          </button>
          <button
            v-if="leave.status === 'waiting'"
            @click="$emit('decline', leave._id)"
          >
            Decline
          </button>
          <button
            v-if="leave.status === 'waiting'"
            @click="$emit('cancel', leave._id)"
          >
            Cancel
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default { props: ["leaves"] };
</script>
