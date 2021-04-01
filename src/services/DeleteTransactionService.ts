import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepostitory = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepostitory.findOne(id);

    if ( transaction ) {

        await transactionRepostitory.remove(transaction);

    } else {

      throw new AppError("Transaction cannot found.");

    }
  }
}

export default DeleteTransactionService;
