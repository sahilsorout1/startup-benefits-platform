# 🚀 Startup Benefits Platform

A full-stack web application that allows startups to browse, filter, and claim exclusive benefits (like AWS credits, Stripe fee waivers, etc.).

## 🌟 Features Implemented

* **Authentication System:** Secure User Registration & Login using **JWT (JSON Web Tokens)**.
* **Deal Dashboard:** View a list of available deals with "Public" and "Locked" access levels.
* **Smart Claim Logic:**
    * Prevents users from claiming the same deal twice (Business Logic).
    * "Locked" deals require specific verification (Mocked logic implemented).
* **Database Seeding:** Automated script to populate the database with dummy deals.
* **Responsive UI:** Built with **Next.js** and **Tailwind CSS**.
* **Secure Backend:** **Node.js/Express** API with middleware for route protection.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (React), Tailwind CSS, Axios, TypeScript.
* **Backend:** Node.js, Express.js, TypeScript.
* **Database:** MongoDB Atlas (Cloud).
* **Security:** JSON Web Token (JWT), BCrypt (password hashing).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisite
Ensure you have **Node.js** installed on your machine.

### 2. Backend Setup (Server)

The server runs on **Port 5001** (to avoid conflicts with AirPlay on Macs).

```bash
cd server
npm install
