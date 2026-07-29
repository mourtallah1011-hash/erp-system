# Products moved to backend

The product module/service/controller were moved to the backend implementation at `src/products` to avoid duplication between backend and frontend codebases. This folder is deprecated and kept only as placeholders to avoid breaking references.

If you want to remove these files completely, delete this `erp-frontend/src/products` folder after ensuring the frontend does not reference it.
