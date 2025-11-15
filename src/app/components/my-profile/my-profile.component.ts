import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  user = {
    name: 'Faruk Shaikh',
    title: 'Full Stack .NET & Angular Developer',
    location: 'Bhopal, India',
    about: `Passionate developer with experience in building enterprise applications,
.NET backend services, and Angular front-end systems.`,
    skills: ['Angular', 'TypeScript', 'HTML', 'CSS', 'C#', '.NET Core', 'SQL Server'],
    experience: [
      {
        role: 'Software Engineer',
        company: 'NewVision Software Pvt. Ltd.',
        duration: 'Jul 2023 - Present',
        description: 'Working on DotNet core, Stored procedures, Angular 18, Azure.'
      }
      ,{
        role: 'Software Developer',
        company: 'Aloha Technology Pvt. Ltd.',
        duration: 'Jan 2020 - Jul 2023',
        description: 'Worked on enterprise financial modules, Stored procedures, API development, and Razor pages.'
      },
    ]
  };
}
