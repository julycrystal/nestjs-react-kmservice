import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { SubmitButton } from "../../../../../shared/button";
import { GetProduct_getProduct_product } from "../../../../../__generated__/GetProduct";
import { getToken } from "../../../../auth/services/localstorage.service";

interface IProductImageComponent {
    coverImage: string | null;
    product: GetProduct_getProduct_product;
}

const ProductImageComponent = ({
    coverImage: uploadedCoverImage,
    product,
}: IProductImageComponent) => {
    const [coverImage, setCoverImage] = useState<string | null>();
    const [currentCoverImage, setCurrentCoverImage] = useState<string | null>();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [coverImageUploading, setCoverImageUploading] =
        useState<boolean>(false);

    const onChange = (name: string, event: any) => {
        if (name === "coverImage") {
            setSelectedFile(event.target.files[0]);
            setCoverImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleUploadCoverImage = (event: any) => {
        event.preventDefault();
        setCurrentCoverImage(coverImage);
        if (coverImage && selectedFile !== null) {
            setCoverImageUploading(true);
            const formData = new FormData();
            formData.set("image", selectedFile);
            fetch(`http://localhost:4000/product/uploadCoverImage/${product.id}`, {
                method: "POST",
                body: formData,
                headers: {
                    "x-jwt": getToken() || "",
                },
            })
                .then(() => {
                    setCoverImageUploading(false);
                })
                .catch(() => {
                    setCoverImageUploading(false);
                })
                .finally(() => {
                    setSelectedFile(null);
                });
        }
    };

    const isCoverImageValid = () => {
        if (uploadedCoverImage) {
            return coverImage !== currentCoverImage;
        }
        return Boolean(coverImage !== currentCoverImage && coverImage !== null);
    };

    useEffect(() => {
        if (uploadedCoverImage) {
            setCoverImage(uploadedCoverImage);
            setCurrentCoverImage(uploadedCoverImage);
        }
    }, [uploadedCoverImage]);

    return (
        <div className="mb-8 px-2">
            <h3 className="my-4 font-bold">Product Images</h3>
            <div className="flex  space-x-5">
                <div className="w-56 space-y-4">
                    <form
                        onSubmit={handleUploadCoverImage}
                        className="w-56 space-y-4"
                        onChange={isCoverImageValid}
                    >
                        {coverImage ? (
                            <div className="relative">
                                <img src={coverImage} className="h-48" />
                                <div
                                    className="absolute -top-3 -right-1 cursor-pointer"
                                    onClick={() => setCoverImage(null)}
                                >
                                    <FontAwesomeIcon className="text-red-500" icon={faTimes} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 border-2 border-dashed flex items-center justify-center border-black">
                                <label className="cursor-pointer" htmlFor="coverImage">
                                    Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="coverImage"
                                    onChange={(event) => onChange("coverImage", event)}
                                    className="hidden"
                                />
                            </div>
                        )}
                        <SubmitButton
                            buttonText="Upload"
                            loading={coverImageUploading}
                            isValid={isCoverImageValid()}
                            classes="w-full"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductImageComponent;
