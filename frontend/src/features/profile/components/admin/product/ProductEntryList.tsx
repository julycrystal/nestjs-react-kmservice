import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries } from '../../../../../__generated__/GetProductEntriesByProduct';

interface IProductEntryList {
    productEntries: GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries[],
    editHandler: (id: number) => void;
    setEntry2Delete: (id: number) => void;
    setShowModal: (data: boolean) => void;
}

const ProductEntryList = ({ productEntries, editHandler, setEntry2Delete, setShowModal }: IProductEntryList) => {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                    <td className="pl-2 py-3">#</td>
                    <td className="">Title</td>
                    <td className="">QTY</td>
                    <td className="">Added By</td>
                    <td className="">Date</td>
                    <td className="">
                        Actions
                    </td>
                </tr>
            </thead>
            <tbody>
                {productEntries.length === 0 && (
                    <tr className="">
                        <td
                            colSpan={6}
                            className="my-4 text-center font-bold w-full"
                        >
                            Empty Entries
                        </td>
                    </tr>
                )}
                {productEntries.length > 0 &&
                    productEntries.map((entry) => {
                        return (
                            <tr
                                key={entry.id}
                                className="w-full cursor-pointer text-center border-b-2 text-sm"
                            >
                                <td className=" py-4">{entry.id}</td>
                                <td className="">{entry.product.title}</td>
                                <td className="">{entry.amount}</td>
                                <td className="">{entry.user.name}</td>
                                <td className="">{moment(entry.entryDate).format("MMM Do YY")}</td>
                                <td className="space-x-4">
                                    <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        title="Edit"
                                        className="cursor-pointer"
                                        onClick={() => editHandler(entry.id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        title="Delete"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setEntry2Delete(entry.id);
                                            setShowModal(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    )
}

export default ProductEntryList
