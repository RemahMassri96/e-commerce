import { EncDecService } from "./../../../../../ecom/core/src/lib/enc-dec.service";
import { IUser } from "./../services/user";
import { Component, OnInit } from "@angular/core";
import { LoginService } from "../services/login.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { strict } from "assert";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: IUser = {
    email: "",
    password: "",
  };

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
    private encService: EncDecService
  ) {}

  ngOnInit(): void {}

  login() {
    this.loginService.login(this.user).subscribe((response) => {
      console.log(response.role);

      if (response.status === "success") {
        const role = this.encService.encrypt(response.role, "");
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("token", response.data);
        this.loginService.isLoggedIn(true);
        this.loginService.userRole(response.role);
        this.navigate(response.role);
      } else {
        this.snackBar.open(response.message, "Login", {
          duration: 1000,
        });
      }
    });
  }

  navigate(role: string) {
    switch (role) {
      case "User":
        console.log("in user navigation");
        // redirect to User
        this.router.navigate(["/user/profile"]);
        break;
      case "Admin":
        console.log("in Admin navigation");
        // redirect to Admin
        this.router.navigate(["/admin/dashboard"]);
        break;
      default:
        this.snackBar.open("User does not belongs to a valid role!", "Login", {
          duration: 1000,
        });
    }
  }
}
