
//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.

void main() {

    Scanner sc=new Scanner(System.in);
    String A=sc.next();

    String reversedString = "";
    for(int i = A.length(); i > A.length() ; i--){

        reversedString = reversedString+A.charAt(i);
    }

    if(A.equalsIgnoreCase(reversedString)) {

        System.out.println("Yes");
    }

}

