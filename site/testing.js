/************************************************************************
*  testing of divide and conquer algorithm in sorting
*  define f(a) as sort array a
* f(a)=f(b)+f(c)+sortTwoSortedArray(b,c)
************************************************************************/
/**
 *
 *function f(a)
 *
 */

 function f(a) {
 //	console.log(a);
 	var len=a.length;
 	if (len==1) return a;
 	var middle=Math.floor((len-1)/2)
 	//divede a to two array
 	//3: 0-1 2
 	//4: 0-1 2-3
 	//5: 0-2 3-4
 	var b=new Array();
 	var c=new Array();
 	for (var i=0; i<len; i++) {
 		if (i<=middle)
 			b[i]=a[i];
 		else
 			c[i-middle-1]=a[i];
 	}
 	//sort b and c
 	b=f(b);
 	c=f(c);
 	a=sortTwoSortedArray(b,c);
 	console.log(a);
 	return a;
 }


 /**
 *
 *function sortTwoSortedArray(b,c)
 *
 */

 function sortTwoSortedArray(b,c) {
 	
 	var bLen=b.length;
 	var cLen=c.length;
 	var a=new Array();
 	var aIndex=0;
 	var bIndex=0;
 	var cIndex=0;
 	//if b  reaches the end, how to compare??
 	while (bLen!=0 || cLen!=0) {
 		if (cLen==0) {
 			a[aIndex]=b[bIndex];
 			aIndex++;
 			bIndex++;
 			bLen--;
 		} else if (b[bIndex]<c[cIndex]) {
 			a[aIndex]=b[bIndex];
 			aIndex++;
 			bIndex++;
 			bLen--;
 		} else {
 			a[aIndex]=c[cIndex];
 			aIndex++;
 			cIndex++;
 			cLen--;
 		}

 		
 		
 	}

 	return a;
 }


 /**
 *
 *function test()
 *
 */

 function test() {
 	//to do
 	var tobe=[6,5,4,3,2,1];
 	tobe=f(tobe);
 }


 test();