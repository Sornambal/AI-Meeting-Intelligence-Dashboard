 from fastapi import HTTPException, Depends
 from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
 from app.config import API_TOKEN
 
 _bearer = HTTPBearer(auto_error=False)
 
 
 def verify_token(credentials: HTTPAuthorizationCredentials = Depends(_bearer)):
     """Use HTTP Bearer scheme for OpenAPI and validate the token from .env.
 
     Raises 401 for missing or invalid token.
     """
     if credentials is None:
         raise HTTPException(status_code=401, detail="Missing Authorization header")
     if credentials.scheme.lower() != "bearer":
         raise HTTPException(status_code=401, detail="Invalid auth scheme")
     if credentials.credentials != API_TOKEN:
         raise HTTPException(status_code=401, detail="Unauthorized")
        return True
