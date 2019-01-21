#include "stdafx.h"
#include "BST.h"
#include <stack>

BST::BST()
{
	rootNode = NULL;

}


BST::~BST()
{
}

BST::BST(CDC * dc)
{
	pDc = dc;
}

CBSTNode * BST::getRoot()
{
	return rootNode;
}

CBSTNode* BST::insert(int a)
{
	CBSTNode *tmp = new CBSTNode(a);
	if (rootNode == NULL) {
		tmp->setParent(NULL);
		rootNode = tmp;
	}
	else {
		CBSTNode *curItem = rootNode;
		CBSTNode *parent = NULL;
		while (curItem != NULL)
		{
			parent = curItem;
			curItem = (a < curItem->getVal()) ? curItem->getLeftChild() : curItem->getRightChild();
		}
		tmp->setParent(parent);

		if (parent->getVal() > a) { //left child
			parent->setLeftChild(tmp);
			tmp->setX(parent->getX() - 40);
			tmp->setY(parent->getY() + 60);
			if (parent->getX() > rootNode->getX()) { // right branch

				while (parent->getParent()->getLeftChild() == parent) {

					parent = parent->getParent();
				}
				updatePos(parent, true);

			}

		}
		if (parent->getVal() <= a) { //right child
			parent->setRightChild(tmp);
			tmp->setX(parent->getX() + 40);
			tmp->setY(parent->getY() + 60);
			if (parent->getX() < rootNode->getX()) { // right branch

				while (parent->getParent()->getRightChild() == parent) {

					parent = parent->getParent();
				}

				updatePos(parent, false);

			}
		}
		/*if (parent->getVal() == a) {
			return NULL;
		}*/
	}
	return tmp;
}

CBSTNode* BST::search(int a, CBSTNode* item)
{
	if (item != NULL) {
		if (a == item->getVal()) {
			return item;
		}
		if (a < item->getVal()) {
			//item->drawShape(pDc, false);
			return search(a, item->getLeftChild());
		}
		if (a >= item->getVal()) {
			//item->drawShape(pDc, true);
			return search(a, item->getRightChild());
		}
	}
	else {
		return NULL;
	}
}

void BST::updatePos(CBSTNode * root, bool flag)
{
	if (root != NULL) {
		int x = root->getX();
		if (flag == true) {
			root->setX(x + 30);
		}
		else {
			root->setX(x - 30);
		}
		updatePos(root->getLeftChild(), flag);
		updatePos(root->getRightChild(), flag);
	}
}

void BST::updatePos(CBSTNode * root, int diffx, int diffy)
{
	if (root != NULL) {
		int x = root->getX();
		int y = root->getY();
		root->setX(x - diffx);
		root->setY(y - diffy);
		updatePos(root->getLeftChild(), diffx, diffy);
		updatePos(root->getRightChild(), diffx, diffy);
	}
}

CBSTNode* BST::search(int a)
{
	return search(a, rootNode);
}


void BST::remove(int a)
{
	return remove(search(a));
}

void BST::remove(CBSTNode* p) {
	if (p == NULL) {
		return;
	}
	else {
		CBSTNode *q = NULL;
		CBSTNode *r = NULL;
		if (p->getLeftChild() == NULL || p->getRightChild() == NULL) {
			q = p;

		}
		else {
			CBSTNode *start = p;
			CBSTNode *parent = p;
			while (start != NULL && start->getLeftChild() != NULL) {
				parent = start;
				start = start->getLeftChild();
			}
			q = start;

		}
		if (p->getLeftChild() != NULL) {

			r = q->getLeftChild();
		}
		if (p->getRightChild() != NULL) {
			r = q->getRightChild();
		}
		if (r != NULL) {
			r->setParent(q->getParent());
		}

		if (q->getParent() == NULL) {
			rootNode = r;
		}
		else if (q == q->getParent()->getLeftChild()) {
			q->getParent()->setLeftChild(r);
		}
		else {
			q->getParent()->setRightChild(r);
		}

		if (q != p) {
			p->setVal(q->getVal());
			
		}
		if (r != NULL) {
			int diffx = r->getX() - q->getX();
			int diffy = r->getY() - q->getY();
			//r->setX(q->getX());
			//r->setY(q->getY());
			updatePos(r, diffx, diffy);
		}


	}

}
void BST::preOrderWalk() {
	m_pNodeList.clear();
	return preOrderWalk(rootNode);
}

void BST::preOrderWalk(CBSTNode* root)
{
	if (root == NULL) {
		return;
	}
	stack<CBSTNode*> nodeStack;
	nodeStack.push(root);
	while (nodeStack.empty() == false)
	{
		CBSTNode* node = nodeStack.top();
		m_pNodeList.push_back(node);
		nodeStack.pop();
		if (node->getRightChild()) {
			nodeStack.push(node->getRightChild());
		}
		if (node->getLeftChild()) {
			nodeStack.push(node->getLeftChild());
		}
	}
	
}

vector<CBSTNode*>* BST::getNodeList()
{
	return &m_pNodeList;
}


CBSTNode* BST::find(CDC * pdc, int val)
{
	return find(pdc, val, rootNode);
}

CBSTNode* BST::find(CDC * pdc, int val, CBSTNode * root)
{	
	if (root != NULL) {
		if (root->getVal() == val) {
			root->drawShape(pdc, 0);
			return root;
		}
		if (root->getVal() > val) {
			root->drawShape(pdc, 1);//left branch
			return find(pdc, val, root->getLeftChild());
		}
		if (root->getVal() < val) {
			root->drawShape(pdc, 2);//right branch
			return find(pdc, val, root->getRightChild());
		}
	}
	else {
		return search(val);
	}
}



