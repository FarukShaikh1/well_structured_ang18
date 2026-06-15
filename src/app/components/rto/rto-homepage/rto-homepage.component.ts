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
  encodedMessage = encodeURIComponent(`Hi Tanveer Daula Sir, I want to connect with you!`);

  contact = {
    address: 'Amravati, Maharashtra, India',
    location: 'Regional Transport Office, Amravati, Maharashtra, India',
    mobile: '+918888869198',
    whatsapp: '+918888869198',
    email: 'tanveershaikhlucky@gmail.com',
    website: 'https://victorious-glacier-026e78e00.3.azurestaticapps.net/',
    courior:'TANVEER MEHBOOB DAULA SHEΙΚΗ, Sundarlal Chowk, SRPF Camp Road, Chaprasi Pura, Shivneri Colony Amravati, Maharashtra 444604, MOBILE: 8888869198/7020948898'
  };

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
