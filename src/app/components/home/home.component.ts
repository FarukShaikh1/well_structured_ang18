import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
// import { SignalRService } from '../../services/signal-r/signal-r.service';
import { RouterModule } from '@angular/router';
import {
    ApplicationModuleActions,
    ApplicationModules,
    ApplicationRoles,
    NavigationURLs
} from '../../../utils/application-constants';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NotificationService } from '../../services/notification/notification.service';
import { HeaderComponent } from '../shared/header/header.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        RouterModule,
        ToasterComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    Modules = ApplicationModules;
    Module_Actions = ApplicationModuleActions;
    displayFeedback: boolean = false;
    currentModuleName: string = '';
    displayFeedbackButton: boolean = true;
    clientId: string = '';
    projectId: string = '';
    formId: string = '';
    formIdOpenedByOtherUser: string = '';
    NavigationURLs = NavigationURLs;
    userName: string = '';
    roleName: string = '';
    roles = ApplicationRoles;
    formDetails: any;
    unreadSystemNotificationCount = 0;

    constructor(
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        public router: Router,
        // public signalRService: SignalRService,
        public globalService: GlobalService,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit() {
        this.loaderService.hideLoader();
        this.notificationService.unreadNotificationCount$.subscribe((count) => {
            this.unreadSystemNotificationCount = count;
        });
        // this.signalRService.getUnreadChatCountForNotification();
        this.getLoggedInUserData();
        this.getLoggedInUserData();
    }

    ngAfterViewInit() {
        this.setDropDownColor();
    }

    clientList() {
        this.router.navigate([NavigationURLs.CLIENT_LIST]);
    }

    userList() {
        this.router.navigate([NavigationURLs.USER_LIST]);
    }

    chatSystem() {
        this.router.navigate([NavigationURLs.NAV_CHAT_PANEL]);
    }

    FeedbackBtnClicked() {
        //Get currentModuleName according to URL or selscted Module
        this.currentModuleName = 'Home';
        this.displayFeedbackButton = !this.displayFeedbackButton;
    }

    closeFeedback() {
        this.displayFeedback = false;
    }

    getLoggedInUserData() {
        const userData = this.localStorageService.getLoggedInUserData();
        if (userData) {
            this.userName = userData.firstName + ' ' + userData.lastName;
            this.roleName = userData.role;
        }
    }

    setDropDownColor() {
        const dropdownButton = document.getElementById('statusDropdown');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        // Add event listeners to each dropdown item
        dropdownItems.forEach((item) => {
            item.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default link behavior

                // Get the status text and color from the clicked item
                const status = item.getAttribute('data-status');
                const color = item.getAttribute('data-color');

                // Update the button text and add a colored dot, if color and status are valid
                if (color && status && dropdownButton) {
                    dropdownButton.innerHTML = `<span class="dot ${color}"></span> ${status}`;
                }
            });
        });
    }

    isUrlContains(urlEndPoint: string): boolean {
        const routePath = this.router.url;
        return routePath.includes(urlEndPoint);
    }
}
