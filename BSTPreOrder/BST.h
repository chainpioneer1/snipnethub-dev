#pragma once
#include "CBSTNode.h"

// BST Tree Class
class BST
{
private:
	CBSTNode * rootNode; // root node of BST
	vector<CBSTNode*> m_pNodeList;//Whole Node List
	CDC *pDc;//draw Range of Node
public:
	BST();
	~BST();
	BST(CDC* dc);

	CBSTNode* getRoot(); // function to get root node
	CBSTNode* insert(int a); // function to get insert/Add
	CBSTNode* search(int a, CBSTNode* item);// function to search item
	void remove(int a);//remove item with value
	void remove(CBSTNode * p);//remove item with node pointer
	
	void updatePos(CBSTNode* root, bool flag);//update node position by its direction (left or right)
	void updatePos(CBSTNode* root, int diffx, int diffy);//update node position by its diff
	CBSTNode* search(int a);//interface invoked by external class

	void preOrderWalk();//Preorder Travesal function
	void preOrderWalk(CBSTNode* root);
	
	vector<CBSTNode*>* getNodeList();//Entire node list
	
	CBSTNode* find(CDC* pdc, int val);
	CBSTNode* find(CDC* pdc, int val, CBSTNode* root);
};

