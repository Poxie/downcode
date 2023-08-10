export const ModalHeader: React.FC<{
    children: any;
    subHeader?: string;
    headerClassName?: string;
}> = ({ children, subHeader, headerClassName='' }) => {
    headerClassName = "text-xl font-semibold " + headerClassName
    return(
        <div className="p-4">
            <h2 className={headerClassName}>
                {children}
            </h2>
            {subHeader && (
                <span>
                    {subHeader}
                </span>
            )}
        </div>
    )
}