const router = require('express').Router(); // api path 를 전달해 주는 메서드
const { postTask } = require('../controllers/postTask');

router.post('/post_task', postTask); // 컨트롤러 함수 연결

module.exports = router; // router 모듈 내보내기