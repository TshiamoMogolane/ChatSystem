//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
void main() {
    //TIP Press <shortcut actionId="ShowIntentionActions"/> with your caret at the highlighted text
    // to see how IntelliJ IDEA suggests fixing it.
    Scanner sc=new Scanner(System.in);
    String A=sc.next();
    System.out.println("Hello world");
    String reversedString = "";
    for(int i = A.length(); i < A.length() ; i--){

        reversedString = reversedString+A.charAt(i);
    }

    if(A.equalsIgnoreCase(reversedString)) {

        System.out.println("Yes");
    }
}
