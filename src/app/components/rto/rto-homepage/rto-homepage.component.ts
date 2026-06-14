import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rto-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rto-homepage.component.html',
  styleUrl: './rto-homepage.component.css'
})
export class RtoHomepageComponent {
   ngOnInit(): void {
    document.body.classList.add('rto-home-page');
  }

  
  ngOnDestroy(): void {
    document.body.classList.remove('rto-home-page');
  }
services = [
  {
    title: 'DRIVING LICENCE',
    icon: '🪪',
    items: [
      'Learner Licence (LL)',
      'Driving Licence Renewal',
      'Duplicate DL',
      'Address Change in DL',
      'International Driving Permit'
    ]
  },
  {
    title: 'VEHICLE SERVICES',
    icon: '🚗',
    items: [
      'RC Transfer',
      'Duplicate RC',
      'Address Change in RC',
      'Hypothecation Addition',
      'Vehicle Fitness Certificate'
    ]
  },
  {
    title: 'PERMIT SERVICES',
    icon: '📄',
    items: [
      'National Permit',
      'State Permit',
      'Goods Vehicle Permit',
      'Tourist Permit'
    ]
  },
  {
    title: 'PUC SERVICES',
    icon: '🌿',
    items: [
      'Pollution Certificate',
      'PUC Renewal Reminder'
    ]
  },
  {
    title: 'INSURANCE SERVICES',
    icon: '🛡️',
    items: [
      'New Vehicle Insurance',
      'Insurance Renewal',
      'Claim Assistance'
    ]
  },
  {
    title: 'OTHER SERVICES',
    icon: '📋',
    items: [
      'NOC Assistance',
      'No Objection Certificate',
      'Sale Agreement',
      'Form 29 & 30 Services'
    ]
  }
];}
