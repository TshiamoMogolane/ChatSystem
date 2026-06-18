package org.example;

import java.util.Scanner;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    static void main() {

        Scanner in = new Scanner(System.in);

        String A = in.next();

        String reversed = new StringBuilder(A).reverse().toString();

        if(reversed.equalsIgnoreCase(A)){
            System.out.println("Yes");
        }

    }
}
