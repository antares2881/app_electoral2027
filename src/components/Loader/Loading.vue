<template>
    <div class="loading-container">
        <div class="loading-box">
            <div class="spinner-wrapper">
                <div class="spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
            </div>
            <p class="loading-text">Cargando...</p>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return{

            }
        }
    }
</script>
<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 40px;
}

.loading-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 50px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 320px;
}

.spinner-wrapper {
    margin-bottom: 20px;
}

.spinner {
    position: relative;
    width: 50px;
    height: 50px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
    border-top-color: #2c3e50;
    animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
    border-top-color: #34495e;
    animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
    border-top-color: #7f8c8d;
    animation-delay: -0.15s;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 15px;
    font-weight: 500;
    color: #2c3e50;
    letter-spacing: 0.5px;
    margin: 0 0 20px 0;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
    background-size: 200% 100%;
    border-radius: 10px;
    animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
    0% {
        width: 0%;
        background-position: 0% 0%;
    }
    50% {
        width: 70%;
        background-position: 100% 0%;
    }
    100% {
        width: 100%;
        background-position: 0% 0%;
    }
}
</style>
