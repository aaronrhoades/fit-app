import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // If the request is going straight to Amazon S3, do NOT touch the headers!
  if (req.url.includes('amazonaws.com')) {
    return next(req);
  }
  
  const token = localStorage.getItem('token');

  // If we have a token, clone the request and add the Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};