import { GrNext, GrPrevious, GrEdit } from "react-icons/gr";
import { TbReload } from "react-icons/tb";
import REST_API from "../support/services/RESTApiService";
import { useState, useEffect } from "react";
import {
	Dropdown,
	Modal,
	TextInput,
	Label,
	Spinner,
	Button,
	Textarea,
} from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";

function BranchAdminProductList() {
	const [addedStock, setaddedStock] = useState(0);
	const [deletedPorductId, setDeletedProductId] = useState();
	const [product, setproduct] = useState();
	const [selectedpage, setselectedpage] = useState(1);
	const [category, setCategory] = useState();
	const [selectedCategory, setSelectedCategory] = useState();
	const [selectedCategoryEdit, setSelectedCategoryEdit] = useState();
	const [sort, setSort] = useState();
	const [img, setimg] = useState();
	const [unit, setunit] = useState();
	const [editedcategoryname, seteditedcategoryname] = useState();
	const [show, setshow] = useState({
		editCategory: false,
		editProduct: false,
		addProduct: false,
		loading: false,
		popUpDeleteCategory: false,
		popUpDeleteProduct: false,
	});
	const [selectedProduct, setSelectedProduct] = useState({
		branch_id: null,
		id: null,
		name: null,
		stock: null,
		price: null,
		img: null,
		description: null,
	});
	const [newProduct, setNewProduct] = useState({
		name: null,
		price: null,
		category_id: null,
		stock: null,
		unit_id: null,
		description: null,
	});

	const getAllProduct = async (page, sort) => {
		try {
			const { data } = await REST_API({
				url: `/admin/branch-admin-product-list?page=${page}&sort=${
					sort ? sort : ""
				}`,
				method: "GET",
			});
			setproduct(data.data.data);
			setselectedpage(page);
			setSort(sort);
		} catch (error) {
			console.log(error);
		}
	};

	const getCategory = async () => {
		try {
			const { data } = await REST_API({
				url: `/admin/get-category`,
				method: "GET",
			});
			setCategory(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getProductCategory = async (id, page, sort) => {
		try {
			const { data } = await REST_API({
				url: `/admin/get-product-by-category?category=${id}&page=${page}&sort=${
					sort ? sort : ""
				}`,
				method: "GET",
			});
			setproduct(data.data);
			setSort(sort);
			setselectedpage(page);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteProduct = async (id) => {
		try {
			await REST_API({
				url: `/admin/delete-product/${id}`,
				method: "DELETE",
			});
			selectedCategory
				? getProductCategory(selectedCategory, selectedpage, "name-asc")
				: getAllProduct(1);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteCategory = async (id) => {
		try {
			await REST_API({
				url: `/admin/delete-category/${id}`,
				method: "DELETE",
			});
			selectedCategory
				? getProductCategory(selectedCategory, selectedpage, "name-asc")
				: getAllProduct(1);
		} catch (error) {
			console.log(error);
		}
	};
	const editCategory = async (id) => {
		try {
			const { data } = await REST_API({
				url: `/admin/get-edited-category?id=${id}`,
				method: "GET",
			});
			setSelectedCategoryEdit(data.data);
			seteditedcategoryname(data.data.name);
		} catch (error) {
			console.log(error);
		} finally {
			setshow({ ...show, editCategory: true });
		}
	};
	const validateImage = (e) => {
		const err = {
			msg1: "Select 1 Image only!",
			msg2: `${e.target.files[0].name} more than 1MB`,
		};
		try {
			if (e.target.files > 1) throw err.msg1;

			if (e.target.files[0].size > 1000000) throw err.msg2;
			setimg(e.target.files[0]);
		} catch (error) {
			toast.error(error);
		}
	};

	const categoryPictureUpdate = async (id) => {
		const fd = new FormData();
		try {
			fd.append("images", img);
			await REST_API({
				url: `/admin/edit-category-image/${id}`,
				method: "PATCH",
				data: fd,
			});
			toast.success("Category picture updated");
		} catch (error) {
			toast.error("Upload image failed");
		}
	};
	const dataCategoryUpdate = async (id, name) => {
		try {
			await REST_API({
				url: `/admin/edit-category-data`,
				method: "PATCH",
				data: { id, name },
			});
			toast.success("Category updated");
		} catch (error) {
			console.log(error);
		}
	};
	const getProductEdit = async (id) => {
		try {
			const { data } = await REST_API({
				url: `/admin/get-product-edit?id=${id}`,
				method: "GET",
			});
			console.log(data.data);

			setSelectedProduct({
				...selectedProduct,
				branch_id: data.data.branch_id,
				id: data.data.product.id,
				name: data.data.product.name,
				stock: data.data.stock,
				price: data.data.product.price,
				img: data.data.product.img,
				description: data.data.product.description,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setshow({ ...show, editProduct: true });
		}
	};

	const getUnit = async () => {
		try {
			const { data } = await REST_API({
				url: "/admin/unit",
				method: "GET",
			});
			setunit(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const editProduct = async () => {
		setshow({ ...show, loading: true });

		try {
			if (img) {
				const fd = new FormData();
				fd.append("images", img);
				fd.append(
					"data",
					JSON.stringify({
						branch_id: selectedProduct.branch_id,
						id: selectedProduct.id,
						name: selectedProduct.name,
						stock: selectedProduct.stock + addedStock,
						price: selectedProduct.price,
						description: selectedProduct.description,
					})
				);
				await REST_API({
					url: "/admin/edit-product",
					method: "PATCH",
					data: fd,
				});
				toast.success("Product updated");
			} else {
				await REST_API({
					url: "/admin/edit-product-no-img",
					method: "PATCH",
					data: {
						branch_id: selectedProduct.branch_id,
						id: selectedProduct.id,
						name: selectedProduct.name,
						stock: selectedProduct.stock + addedStock,
						price: selectedProduct.price,
						description: selectedProduct.description,
					},
				});
				toast.success("Product updated no image");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setshow({ ...show, editProduct: false });
		}
	};
	const createProduct = async () => {
		setshow({ ...show, loading: true });
		const fd = new FormData();
		fd.append("images", img);
		fd.append("data", JSON.stringify(newProduct));
		try {
			await REST_API({
				url: "/admin/create-product",
				method: "POST",
				data: fd,
			});
			toast.success("Product added");
		} catch (error) {
			console.log(error);
		} finally {
			setshow({ ...show, editProduct: false });
		}
	};

	function PreviewImage() {
		var oFReader = new FileReader();
		oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);

		oFReader.onload = function (oFREvent) {
			document.getElementById("uploadPreview").src = oFREvent.target.result;
		};
	}

	useEffect(() => {
		getAllProduct(1);
		getCategory();
		getUnit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className=" w-full px-2 md:px-10">
			{console.log(addedStock)}
			<button
				onClick={() => {
					getAllProduct(1);
					setSort();
					setSelectedCategory();
				}}
				className="h-6 bg-[#0095DA] text-white rounded-lg mb-2 px-4 "
			>
				<p className="text-md">All Category</p>
			</button>
			<div className="grid md:grid-cols-10 grid-cols-2 gap-2 pb-4">
				{category
					? category.map((value, index) => {
							return (
								<div
									key={index}
									className="text-white flex items-center justify-start"
								>
									<button
										onClick={() => {
											getProductCategory(value.id, 1);
											setSelectedCategory(value.id);
											setSort();
											setselectedpage(1);
										}}
										className="w-full bg-[#0095DA] py-1 rounded-l-lg "
									>
										<p className="text-md">{value.name}</p>
									</button>
									<button
										onClick={() => editCategory(value.id)}
										className="bg-[#0095DA] rounded-r-lg pr-1 py-2"
									>
										<GrEdit className="text-white" />
									</button>
								</div>
							);
					  })
					: null}
			</div>
			<div className="mb-2 flex space-x-2">
				<Dropdown
					class="bg-[#0095da] rounded-md text-white"
					label="Sort"
					dismissOnClick={false}
				>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(selectedCategory, selectedpage, "name-asc")
								: getAllProduct(selectedpage, "name-asc");
						}}
					>
						A-Z
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"name-desc"
								  )
								: getAllProduct(selectedpage, "name-desc");
						}}
					>
						Z-A
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"price-desc"
								  )
								: getAllProduct(selectedpage, "price-desc");
						}}
					>
						Higest Price
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"price-asc"
								  )
								: getAllProduct(selectedpage, "price-asc");
						}}
					>
						Lowest Price
					</Dropdown.Item>
				</Dropdown>
				<Button
					onClick={() => setshow({ ...show, addProduct: true })}
					class="bg-[#0095da] rounded-md text-white"
				>
					Add product
				</Button>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-7 h-auto">
				{product
					? product.map((value, index) => {
							return (
								<div
									key={index}
									className="flex flex-col h-[280px] sm:h-[350px]  shadow-xl justify-between w-full  border border-gray-200 rounded-lg"
								>
									<img
										className="rounded-t-lg h-46 object-cover"
										src={value.product.img}
										alt="product"
									/>
									<div className="p-5">
										<h5 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
											{value.product.name}
										</h5>
										<h4 className="text-sm">Jumlah Stok {value.stock}</h4>
										<div className="flex items-center justify-between">
											<span className="text-xs font-bold text-gray-900 dark:text-white">
												Rp. {value.product.price.toLocaleString()}
											</span>
										</div>
									</div>
									<div className=" flex justify-center sm:justify-end pb-4 gap-1 sm:mr-2 ">
										<button
											onClick={() => getProductEdit(value.product.id)}
											className="text-[#0095DA] rounded-md px-4 py-1 hover:text-white hover:bg-[#0095DA]  !text-xs"
										>
											Edit
										</button>
										<button
											onClick={() => {
												setshow({ ...show, popUpDeleteProduct: true });
												setDeletedProductId(value.id);
											}}
											className="text-red-600 rounded-md px-4 py-1 hover:text-white hover:bg-red-700 !text-xs"
										>
											Delete
										</button>
									</div>
								</div>
							);
					  })
					: null}
			</div>

			<div className="mt-24 flex justify-center items-center my-5 pb-10 ">
				<label className="p-1">page</label>
				<button
					className="bg-[#0095DA] text-white border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
					onClick={
						selectedCategory
							? () => getProductCategory(selectedCategory, selectedpage - 1)
							: () => getAllProduct(selectedpage - 1)
					}
					disabled={parseInt(selectedpage) === 1}
				>
					<GrPrevious />
				</button>
				<input
					type="text"
					value={selectedpage}
					onChange={(e) => {
						selectedCategory
							? getProductCategory(selectedCategory, e.target.value, sort)
							: getAllProduct(parseInt(e.target.value, sort));
						setselectedpage(e.target.value ? parseInt(e.target.value) : 0);
					}}
					className="w-8 p-1 border-0"
				/>
				<button
					className="bg-[#0095DA] text-white  border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
					onClick={
						selectedCategory
							? () =>
									getProductCategory(selectedCategory, selectedpage + 1, sort)
							: () => getAllProduct(selectedpage + 1, sort)
					}
					// disabled={parseInt(selectedpage) === parseInt(page)}
				>
					<GrNext />
				</button>
				<label className="p-1" htmlFor="">
					{/* of {page} */}
				</label>
			</div>
			<Modal
				show={show.editCategory}
				size="md"
				onClose={() => setshow({ ...show, editCategory: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Edit {selectedCategoryEdit?.name} category details
						</h3>
						<div className="space-y-2">
							<div className="mb-2 block">
								<Label htmlFor="password" value="Edit category name" />
							</div>
							<div className="flex justify-center">
								<img
									src={selectedCategoryEdit?.img}
									alt="category"
									className="w-1/2"
								/>
							</div>
							<TextInput
								defaultValue={selectedCategoryEdit?.name}
								type="text"
								onChange={(e) => seteditedcategoryname(e.target.value)}
							/>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Edit category image" />
							</div>
							<input
								type="file"
								name="myImage"
								accept="image/png, image/gif, image/jpeg, image/jpg"
								onChange={(e) => validateImage(e)}
								className="rounded-lg bg-slate-500 text-white"
							/>
							<p className="text-xs">Upload image with .jpg, .png, .jpeg</p>
							<p className="text-xs">Max size 1MB</p>
						</div>
						<div className="w-full flex justify-end space-x-2">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() =>
										setshow({ ...show, popUpDeleteCategory: true })
									}
									color="failure"
								>
									Delete category
								</Button>
							)}
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() => {
										categoryPictureUpdate(selectedCategoryEdit.id);
										dataCategoryUpdate(
											selectedCategoryEdit.id,
											editedcategoryname
										);
									}}
								>
									Submit
								</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.addProduct}
				size="6xl"
				onClose={() => setshow({ ...show, addProduct: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Add product
						</h3>
						<div className="space-y-2 grid grid-cols-2 gap-10">
							<div>
								<div className="mb-2 block">
									<Label htmlFor="name" value="Edit product name" />
								</div>
								<TextInput
									value={newProduct.name}
									onChange={(e) =>
										setNewProduct({ ...newProduct, name: e.target.value })
									}
									type="text"
								/>
								<div className="flex space-x-3">
									<div className="w-full">
										<div className="mb-2 block">
											<Label htmlFor="price" value="Edit product price" />
										</div>
										<TextInput
											value={newProduct.price}
											onChange={(e) =>
												setNewProduct({ ...newProduct, price: e.target.value })
											}
											type="number"
										/>
									</div>
									<div className="w-full">
										<div className="mb-2 block">
											<Label
												htmlFor="countries"
												value="Select product category"
											/>
										</div>
										<select
											id="category"
											onChange={(e) =>
												setNewProduct({
													...newProduct,
													category_id: e.target.value,
												})
											}
											className="bg-gray-50 w-full border py-[8.5px] border-gray-300 text-gray-900 text-md rounded-lg "
										>
											<option selected disabled={true}>
												Choose category
											</option>
											{category?.map((value, index) => {
												return (
													<option key={index} value={value.id}>
														{value.name}
													</option>
												);
											})}
										</select>
									</div>
								</div>
								<div className="flex space-x-3">
									<div className="w-full">
										<div className="mb-2 block">
											<Label htmlFor="stock" value="Edit product stock" />
										</div>
										<TextInput
											value={newProduct.stock}
											onChange={(e) =>
												setNewProduct({ ...newProduct, stock: e.target.value })
											}
											type="number"
										/>
									</div>
									<div className="w-full">
										<div className="mb-2 block">
											<Label htmlFor="countries" value="Select product unit" />
										</div>
										<select
											id="unit"
											onChange={(e) =>
												setNewProduct({
													...newProduct,
													unit_id: e.target.value,
												})
											}
											className="bg-gray-50 w-full border py-[8.5px] border-gray-300 text-gray-900 text-md rounded-lg "
										>
											<option selected disabled={true}>
												Choose unit
											</option>
											{unit?.map((value, index) => {
												return (
													<option key={index} value={value.id}>
														{value.name}
													</option>
												);
											})}
										</select>
									</div>
								</div>
								<div className="mb-2 block">
									<Label
										htmlFor="description"
										value="Edit product description"
									/>
								</div>
								<Textarea
									value={newProduct.description}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											description: e.target.value,
										})
									}
									rows={5}
								/>
							</div>
							<div>
								<div className="flex justify-center">
									<img
										src="#"
										alt="new product"
										id="uploadPreview"
										className="rounded-md"
									/>
								</div>
								<div className="mb-2 block">
									<Label htmlFor="password" value="Edit product image" />
								</div>
								<input
									type="file"
									name="myImage"
									id="uploadImage"
									accept="image/png, image/gif, image/jpeg, image/jpg"
									onChange={(e) => {
										validateImage(e);
										PreviewImage();
									}}
									className="rounded-lg bg-slate-500 text-white w-full"
								/>
								<p className="text-xs">Upload image with .jpg, .png, .jpeg</p>
								<p className="text-xs">Max size 1MB</p>
							</div>
						</div>
						<div className="w-full flex justify-end space-x-2">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button onClick={() => createProduct()}>Submit</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.editProduct}
				size="6xl"
				onClose={() => setshow({ ...show, editProduct: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Edit product details
						</h3>
						<div className="space-y-2 grid grid-cols-2 gap-10">
							<div>
								<div className="mb-2 block">
									<Label htmlFor="name" value="Edit product name" />
								</div>
								<TextInput
									defaultValue={selectedProduct?.name}
									onChange={(e) =>
										setSelectedProduct({
											...selectedProduct,
											name: e.target.value,
										})
									}
									type="text"
								/>
								<div className="mb-2 block">
									<Label htmlFor="stock" value="Edit product stock" />
								</div>
								<div className="grid grid-cols-4 space-x-3">
									<TextInput
										defaultValue={selectedProduct?.stock}
										disabled
										className="w-full"
										type="text"
									/>
									<div className="flex col-span-3 space-x-2">
										<button
											onClick={() =>
												setaddedStock(addedStock > 0 ? -100 : addedStock - 100)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											-100
										</button>
										<button
											onClick={() =>
												setaddedStock(addedStock > 0 ? -10 : addedStock - 10)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											-10
										</button>
										<button
											onClick={() =>
												setaddedStock(addedStock > 0 ? -1 : addedStock - 1)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											-
										</button>
										<div className="relative">
											<TextInput
												value={addedStock}
												disabled
												className="w-full"
												type="text"
											/>
											<button
												onClick={() => setaddedStock(0)}
												className="absolute right-2 top-3"
											>
												<TbReload />
											</button>
										</div>
										<button
											onClick={() =>
												setaddedStock(addedStock < 0 ? 1 : addedStock + 1)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											+
										</button>
										<button
											onClick={() =>
												setaddedStock(addedStock < 0 ? 10 : addedStock + 10)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											+10
										</button>
										<button
											onClick={() =>
												setaddedStock(addedStock < 0 ? 100 : addedStock + 100)
											}
											className="border rounded-md text-xs px-2 bg-[#0095da] text-white"
										>
											+100
										</button>
									</div>
								</div>
								<div className="mb-2 block">
									<Label htmlFor="stock" value="Edit product price" />
								</div>
								<TextInput
									defaultValue={selectedProduct?.price}
									onChange={(e) =>
										setSelectedProduct({
											...selectedProduct,
											price: e.target.value,
										})
									}
									type="text"
								/>
								<div className="mb-2 block">
									<Label htmlFor="name" value="Edit product description" />
								</div>
								<Textarea
									rows={5}
									defaultValue={selectedProduct?.description}
									onChange={(e) =>
										setSelectedProduct({
											...selectedProduct,
											description: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<div className="flex justify-center">
									<img
										src={selectedProduct?.img}
										alt="category"
										className="rounded-md"
									/>
								</div>
								<div className="mb-2 block">
									<Label htmlFor="password" value="Edit product image" />
								</div>
								<input
									type="file"
									name="myImage"
									accept="image/png, image/gif, image/jpeg, image/jpg"
									onChange={(e) => validateImage(e)}
									className="rounded-lg bg-slate-500 text-white w-full"
								/>
								<p className="text-xs">Upload image with .jpg, .png, .jpeg</p>
								<p className="text-xs">Max size 1MB</p>
							</div>
						</div>
						<div className="w-full flex justify-end space-x-2">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() => {
										setSelectedProduct({
											...selectedProduct,
											stock: selectedProduct.stock + addedStock,
										});
										editProduct();
									}}
								>
									Submit
								</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.popUpDeleteCategory}
				size="md"
				onClose={() => setshow({ ...show, popUpDeleteCategory: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Delete this category?
						</h3>
						<div className="w-full flex justify-end space-x-2">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() =>
										setshow({ ...show, popUpDeleteCategory: false })
									}
									color="failure"
								>
									No
								</Button>
							)}
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() => deleteCategory(selectedCategoryEdit?.id)}
									color="success"
								>
									Yes
								</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.popUpDeleteProduct}
				size="md"
				onClose={() => setshow({ ...show, popUpDeleteProduct: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Delete this product?
						</h3>
						<div className="w-full flex justify-end space-x-2">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() =>
										setshow({ ...show, popUpDeleteProduct: false })
									}
									color="failure"
								>
									No
								</Button>
							)}
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button
									onClick={() => deleteProduct(deletedPorductId)}
									color="success"
								>
									Yes
								</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Toaster />
		</div>
	);
}

export default BranchAdminProductList;
