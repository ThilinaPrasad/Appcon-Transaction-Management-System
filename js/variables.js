let global_username = sessionStorage.getItem("userName");
let loadedData = localStorage.getItem('loadedData');
const url = new URL(window.location.href);
let isRouted = url.searchParams.get("isRouted") !== null;
let connection;
