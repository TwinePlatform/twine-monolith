# Developer notes

A place to document gotchya's whilst working with react native & the twine platform architecture

- react components will not let you reach outside of the root directory for enum imports, but other files can
- there seem to be update issues with navigating in components that call dispatch/select. Left api call in AuthenticationLoader for now, but may need further investigation if this causes issues elsewhere. 
