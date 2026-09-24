# AdaptIQ AI: Architecture

```
 Student (browser)
       |
       v
 CLIENT  (React)          what the student sees
       |  HTTP requests (JSON)
       v
 SERVER  (Node + Express) the brain: login, rules, saves data
   |        |         |
   v        v         v
 MongoDB   ML SERVICE   LLM API
 (storage) (Python +    (AI tutor, quiz
            FastAPI)     generator)
```

## The adaptive loop

Student activity -> data -> analysis -> weak topics -> ML prediction -> personalized plan -> practice -> new data