// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    const transactionRepostitory = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionRepostitory.getBalance();

      if (value > total) {
        throw new AppError('Transaction cannot be performed. Insufficient funds.');
      }
    }

    let categoryTransaction = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if ( !categoryTransaction ) {
      categoryTransaction = categoryRepository.create({
        title: category
      });

      await categoryRepository.save(categoryTransaction);
    }

    const transaction = transactionRepostitory.create({
      title,
      value,
      type,
      category: categoryTransaction
    });

    await transactionRepostitory.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
