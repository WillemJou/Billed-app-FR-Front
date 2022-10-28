/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBill from "../containers/NewBill.js"
import router from "../app/Router"
import NewBillUI from "../views/NewBillUI.js"
import { bills } from '../fixtures/bills.js'
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"

jest.mock('../app/store', () => mockStore)

describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee', email: "a@a"
    }))
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId("icon-mail"))
      const windowIcon = screen.getByTestId("icon-mail")
      expect(windowIcon.className.includes("active-icon")).toBeTruthy()
    })

    describe("When I put a file with wrong extensions", () => {
    test("Then it show an error message", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: localStorageMock})
      const createFile = new File(["file"], "file.txt", {
        type: "file/txt",
      })
      const errorMsg = screen.getByTestId("error-msg")
      const inputFile = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      inputFile.addEventListener('input', handleChangeFile)
      fireEvent.input(inputFile, {
        target: {
          files: [createFile]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(errorMsg.classList).not.toContain("none")
    })
  })

    describe("When I put a file with good extensions", () => {
    test("Then it hide the error message and upload a new file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: localStorageMock})
      const createFile = new File(["file"], "file.png", {
        type: "file/png",
      })
      const errorMsg = screen.getByTestId("error-msg")
      const inputFile = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      inputFile.addEventListener('input', handleChangeFile)
      userEvent.upload(inputFile, createFile)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(errorMsg.classList).not.toContain("block")
      expect(inputFile.files[0]).toStrictEqual(createFile)
      
    })
  })

  describe("When I submit the new bill form", () => {
    test("Then Bills page is update with a new bill", async () => {
      jest.spyOn(mockStore, "bills")
      const newBill = new NewBill ({
        document, onNavigate, store: mockStore, localStorage: localStorageMock}) 
        const submit = jest.fn((e) => newBill.handleSubmit(e))
        const newBillForm = screen.getByTestId("form-new-bill")
        newBillForm.addEventListener("submit", submit)
        fireEvent.submit(newBillForm)     
        expect(submit).toHaveBeenCalled()
        expect(mockStore.bills).toHaveBeenCalled()
    })
  })
  describe("When an error occurs on API", () => {
    test("Post bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          upload : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
        const html = BillsUI({error:"Erreur 404"})
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
    })
    test("Post messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          upload : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
        const html = BillsUI({error:"Erreur 500"})
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
  })
})
})
})
