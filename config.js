const localDevelopmentHosts = ["localhost", "127.0.0.1"];

window.STUDY_PLANNER_API_URL = localDevelopmentHosts.includes(window.location.hostname)
    ? "http://localhost:8080"
    : "https://study-planner-backend-7krr.onrender.com";