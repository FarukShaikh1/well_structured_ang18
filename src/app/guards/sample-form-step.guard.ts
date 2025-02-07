// import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { SampleSubmissionService } from '../../services/sample-forms/sample-submission.service';

// export const sampleFormStepGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
//   const sampleSubmissionService = inject(SampleSubmissionService);
//   const router = inject(Router);

//   // Check the full route URL to find the current step
//   const currentUrl = state.url;
//   const stepMatch = currentUrl.match(/step(\d+)/);

//   let stepNumber = 1;
//   if (stepMatch) {
//     stepNumber = parseInt(stepMatch[1], 10); // Extract the step number from the match
//   }

//   // Check if the previous step is completed
//   if (stepNumber > 1 && !sampleSubmissionService.isStepCompleted(stepNumber - 1)) {
//     // Redirect to the last completed step if the previous step is not completed
//     const lastCompletedStep = stepNumber - 1; // Get the last completed step
//     router.navigate([`/home/sample-submission/step${lastCompletedStep}`]);
//     return false;
//   }

//   return true;
// };
