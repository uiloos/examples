<template>
  <Timeline
    :items="[
      {
        id: 1,
        name: 'jQuery',
        description:
          'jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery has changed the way that millions of people write JavaScript.',
        released: 'August 2006',
      },
      {
        id: 2,
        name: 'Backbone',
        description:
          'Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.',
        released: 'October 2010',
      },
      {
        id: 3,
        name: 'AngularJS',
        description:
          'AngularJS is a toolset for building the framework most suited to your application development. It is fully extensible and works well with other libraries.',
        released: 'October 2010',
      },
      {
        id: 4,
        name: 'Ember.js',
        description:
          'Ember.js is a productive, battle-tested JavaScript framework for building modern web applications. It includes everything you need to build rich UIs that work on any device.',
        released: 'December 2011',
      },
      {
        id: 5,
        name: 'React',
        description:
          'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
        released: 'May 2013',
      },
      {
        id: 6,
        name: 'Vue',
        description:
          'An approachable, performant and versatile framework for building web user interfaces.',
        released: 'February 2014',
      },
      {
        id: 7,
        name: 'Angular',
        description:
          'Angular is a platform for building mobile and desktop web applications. Join the community of millions of developers who build compelling user interfaces.',
        released: 'September 2016',
      },
      {
        id: 8,
        name: 'Svelte',
        description:
          'Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.',
        released: 'November 2016',
      },
    ]"
  />
</template>

<script setup lang="ts">
import Timeline from "./Timeline.vue";
</script>
