# Flow Parity Verification

## Scope

This review keeps Flow as a separate product boundary. It compares only public rendering and entry-route availability; it does not submit forms, attempt sign-in, access protected data, or alter the external Flow backend.

## Fresh Evidence — 2026-09-16

| Route group                                                                                  | Live result                                                                                       | Feature preview result                                | Current conclusion                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/flow` landing                                                                              | Rendered the Flow hero, product navigation, assessment actions, role explanation, and calculator. | Rendered the intended Flow hero and product controls. | No current parity issue confirmed.                                                                                                                                                                    |
| `/flow/login`                                                                                | Rendered the intended email/password sign-in, recovery, and registration controls.                | Rendered the intended account-entry screen.           | No current parity issue confirmed.                                                                                                                                                                    |
| `/flow/signup`, `/flow/assessment`, `/flow/team-dashboard`, `/flow/pricing`, `/flow/science` | Returned HTTP 200 with matching document titles.                                                  | Returned HTTP 200 with matching document titles.      | The local screenshot batch showed the generic Greenberg Ecosystem fallback above the fold for the latter four routes; direct live visual checks are required before treating that as a parity defect. |

## Protected Conclusion

The verified Flow landing and sign-in screens do not show a current generic-fallback defect. The local `/flow/assessment` route was then opened from a freshly built production-mode server and rendered the complete primary assessment introduction, matching the live route. The ecosystem-only view is therefore limited to the managed development renderer, where Next reported an internal router-initialization error while serving development resources through the preview proxy. No Flow source code, authentication behavior, or upstream service configuration needs to change for the deployed application.
