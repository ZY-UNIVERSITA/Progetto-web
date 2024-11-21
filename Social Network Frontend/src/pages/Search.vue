<template>
    <div class="search-container">
      <!-- Casella di ricerca -->
      <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search..."/>
        <!--
            <section v-if="searchResults.length">
                <section v-for="result in searchResults" :key="result.id" class="search-result">
                <p>{{ result.name || result.content }}</p>
                </section>
            </section>
        -->
        <!-- section v-else -->
      <section>
        <p>No results found.</p>
      </section>
    </div>
  </template>