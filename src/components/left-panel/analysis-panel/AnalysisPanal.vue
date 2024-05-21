<script setup></script>

<template>
  <div>
    <p>This panel is gooing to be developed.</p>
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#digitalBorehole"
        aria-expanded="false"
        aria-controls="digitalBorehole"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrows-expand"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
          />
        </svg>
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
        class="btn btn-primary text-start"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#profile"
        aria-expanded="false"
        aria-controls="profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrows-expand"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
          />
        </svg>
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
