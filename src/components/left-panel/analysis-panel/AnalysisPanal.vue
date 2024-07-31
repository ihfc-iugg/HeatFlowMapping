<script setup></script>

<template>
  <div>
    <p>This panel is gooing to be developed.</p>
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#digitalBorehole"
        aria-expanded="false"
        aria-controls="digitalBorehole"
      >
        Digital Borehole
      </button>
    </p>
    <div class="collapse" id="digitalBorehole">
      <p>
        This feature should allow you to draw a point on the map and get a graph with the
        temperature depending on the depth. The values are derived from neighborhood relationships
        to existing data points.
      </p>
      <img src="@/assets/img/digital_borehole_example.png" alt="Digital Borehole" />
    </div>

    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#profile"
        aria-expanded="false"
        aria-controls="profile"
      >
        2D Profile
      </button>
    </p>
    <div class="collapse" id="profile">
      <p>
        This feature allows you to draw a line on the map and visualize the course of a selected
        attribute along the line. The values along the line are derived from neighborhood
        relationships to existing data points.
      </p>
      <img src="@/assets/img/2D_profile.png" alt="2D Profile" width="100%" />
    </div>
  </div>
</template>

<style></style>
